/**
 * Created by jonathan on 18.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models.js');
var BookingModel = require('../models.js').BookingModel;

var config = require('../../config');

var mail = require('../../lib/mail.js');

function assert(condition, message) {
  if (!condition) {
    console.log('Assertion failed', message);
    console.trace();
    throw message || "Assertion failed";
  }
}

///////////////////////
// read/write filters

BookingModel.readFilter(function (req) {
  return false;  // only server is allowed to make changes
});

BookingModel.writeFilter(function (obj, req) {
  return false;  // only server is allowed to make changes
});

///////////////////////
// Operation Impl.

var paymill = require('paymill-node')(config.paymill.PAYMILL_PRIVATE_KEY);

// run payment with paymill-backend
var pay = function (bookingObj, paymentToken, amount_int, currency) {
  console.log("in pay()", arguments);

  return Q()
  //    .then(function() {
  //      return Q.nfcall(paymill.clients.create, {  // ein client bei paymill anlegen (optional)
  //        email: bookingObj.profile.email,
  //        description : util.format('Client: %s, %s (tel: %s)',
  //          bookingObj.profile.lastName, bookingObj.profile.firstName, bookingObj.profile.tel)
  //      })
  //    })
    .then(function () {
      return Q.nfcall(paymill.payments.create, {  // eine Zahlung anlegen
        token: paymentToken
//        client: client.id
      });
    })
    .then(function (payment) {
      return Q.nfcall(paymill.transactions.create, {  // die Transaktion durchführen
        amount: amount_int,
        currency: currency,
        payment: payment.data.id,
        description: JSON.stringify({
          bookingId: bookingObj._id
        }) // description has a max length of 127 chars - so only id fits in (paymill error 40402 RESPONSE_DATA_INPUT_USAGE_TOO_LONG: usage field too long) !! -> https://app.asana.com/0/16075887606903/20894991803239
      });
    })
    .then(function (transaction) {
      console.log("transaction successfull");
      console.log("transaction", transaction.data);

      // @TODO
      // E-Mail versenden ohne Promise - E-Mailversand darf auch fehlschlagen

      // update booking state
      bookingObj.state = "booked";
      bookingObj.transactionId = transaction.data.id;
      return bookingObj.save();
    });

};

BookingModel.operationImpl("checkout", function (params, req) {
  console.log("In checkout()", params);

  assert(params.bookings && Array.isArray(params.bookings), "you need to provide a bookings-array");
  assert(params.payment, "you need to provide payment informations");
  assert(params.profile, "you need to provide a profile");
  assert(params.languageKey, "you need to provide a languageKey");

  var booking = BookingModel.create();

  return Q()
    .then(function () {
      var checkAvailableBookings = [];
      _.forEach(params.bookings, function (booking) {
        checkAvailableBookings.push(
          models.ActivityModel.get(ObjectId(booking.activity))
            .then(function (activity) {
              if (booking.quantity > activity.getChild(booking.event).availableQuantity) {
                return Q.reject(new Error("There are not enough events available for booking"));
              }
              if (booking.quantity < 1) {
                return Q.reject(new Error("Quantity has to be > 0"));
              }
              if (booking.quantity % 1 !== 0) {
                return Q.reject(new Error("Quantity has to be an integer value"));
              }

              return Q.resolve();
            })
        );
      });

      return Q.all(checkAvailableBookings);
    })

    .then(function () {
      // get the sum of booked events from database to validate against payment gateway amount
      var bookingPrices = [];

      function calculatePrice(event, booking) {
        if (event.groupEvent) {
          return groupEventPriceCalcutation(event, booking);
        } else {
          return singleEventPriceCalcutation(event, booking);
        }

        function groupEventPriceCalcutation(event, booking) {
          var additionalPersonsPrice = 0;
          var groupEventPrice = event.priceForGroupEvent;

          if (booking.groupEventAdditionalPersons > 0) {
            additionalPersonsPrice = event.priceForAdditionalPerson * booking.groupEventAdditionalPersons;
          }

          return groupEventPrice + additionalPersonsPrice;
        }

        function singleEventPriceCalcutation(event, booking) {
          return event.price * booking.quantity;
        }
      }

      _.forEach(params.bookings, function (booking) {
        bookingPrices.push(
          models.ActivityModel.get(ObjectId(booking.activity))
            .then(function (activity) {
              return Q.resolve(calculatePrice(activity.getChild(booking.event), booking));
            })
        );
      });

      return Q.all(bookingPrices)
        .then(function (prices) {
          var total = prices.reduce(function (aggr, price) {
            aggr += price;
            return aggr;
          }, 0);
          return Q.resolve(total);
        });
    })
    .then(function (priceSum) {
      // validate payment amount against database ammount
      var priceInt = Math.floor(priceSum * 100);
      if (priceInt !== params.payment.amount_int) {
        // the price calculated from the db does not match the ammount booked on paymill
        return Q.reject(new Error("invalid price amount_int"));
      }

      return booking.save();
    })
    .then(function () {
      // init profile
      booking.profile.firstName = params.profile.firstName;
      booking.profile.lastName = params.profile.lastName;
      booking.profile.email = params.profile.email;
      booking.profile.tel = params.profile.tel;

      booking.payment.amount_int = params.payment.amount_int;
      booking.payment.currency = params.payment.currency;

      if (req.isAuthenticated()) {  // user is loggedin save the user
        booking.user._reference = ObjectId(req.user._id);
      }

      // perform payment
      return pay(booking, params.payment.token, params.payment.amount_int, params.payment.currency);
    })
    .then(function () {

      var bookingPromises = [];

      _.forEach(params.bookings, function (bookingEvent) {
        assert(bookingEvent.activity, "provide an activity");
        assert(bookingEvent.item, "provide an item");
        assert(bookingEvent.event, "provide an event");
        assert(bookingEvent.quantity, "provide a quantity");

        bookingPromises.push(
          Q()
            .then(function () {
              return models.ActivityModel.get(ObjectId(bookingEvent.activity));
            })
            .then(function (activity) {  // get an _id

              var bookedEvent = models.BookedEventModel.create();
              bookedEvent.booking.setObject(booking);

              bookedEvent.bookingProfile.firstName = booking.profile.firstName;
              bookedEvent.bookingProfile.lastName = booking.profile.lastName;
              bookedEvent.bookingProfile.email = booking.profile.email;
              bookedEvent.bookingProfile.tel = booking.profile.tel;

              bookedEvent.activity.setObject(activity);
              bookedEvent.activity_owner = activity.owner;

              bookedEvent.item.set(activity, {_id: bookingEvent.item});
              bookedEvent.event.set(activity, {_id: bookingEvent.event});

              bookedEvent.quantity = bookingEvent.quantity;

              bookedEvent.activityCopy = activity;  // kopie der orginal-daten
              return bookedEvent.save();
            })
        );

      });

      return Q.all(bookingPromises);
    })
    .then(function (bookedEvents) {
      // send checkout confirmation email to user

      var bookingdata = {
        booking: booking,
        amount: booking.payment.amount_int / 100,
        languageKey: params.languageKey,
        bookedEvents: []
      };

      bookedEvents.forEach(function (bookedEvent) {
        bookingdata.bookedEvents.push({
          bookedEvent: bookedEvent,
          item: bookedEvent.item.ref(),
          event: bookedEvent.event.ref(),
          activity: bookedEvent.activity.ref()
        });
      });

      mail.sendBookingConfirmationEmailToCustomer(bookingdata);

      mail.sendBookingConfirmationEmailToProviders(bookingdata);

      return {
        state: "ok",
        bookingId: booking._id
      };
    })
    .catch(function (err) {
      console.error(err);
      return {
        state: "err",
        error: err.message
      };
    });
});


