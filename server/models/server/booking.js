/**
 * Created by jonathan on 18.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');
var util = require('util');

var models = require('../models.js');
var BookingModel = require('../models.js').BookingModel;

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

var PAYMILL_PRIVATE_KEY = '34e632de2eb8de9a92caea85fab7f380';
var paymill = require('paymill-node')(PAYMILL_PRIVATE_KEY);

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
      })
    })
    .then(function (payment) {
      return Q.nfcall(paymill.transactions.create, {  // die Transaktion durchführen
        amount: amount_int,
        currency: currency,
        payment: payment.data.id,
        description: util.format('Booking id: %s (From: %s %s, E-Mail: %s, Tel: %s)',
          bookingObj._id, bookingObj.profile.firstName, bookingObj.profile.lastName, bookingObj.profile.email, bookingObj.profile.tel)
      })
    })
    .then(function (transaction) {
      console.log("transaction successfull");
      console.log("transaction", transaction.data);

      // update booking state
      bookingObj.state = "booked";
      bookingObj.transactionId = transaction.data.id;
      return bookingObj.save();
    });

};

/**
 *  TODO:
 *   - verfügbarkeits check zuerst
 *   - profile optional machen (vlt ist der user schon eingeloggt
 */

BookingModel.operationImpl("checkout", function (params, req) {
  console.log("In checkout()", params);

  assert(params.bookings && Array.isArray(params.bookings), "you need to provide a bookings-array");
  assert(params.payment, "you need to provide payment informations");
  assert(params.profile, "you need to provide a profile");

  var booking = BookingModel.create();

  return Q()
    .then(function () {

      var checkAvailableBookings = [];

      _.forEach(params.bookings, function (booking) {
        var activity;

        checkAvailableBookings.push(
          Q()
            .then(function () {
              return models.ActivityModel.get(ObjectId(booking.activity));
            })
            .then(function (_activity) {
              activity = _activity;
              return models.BookedEventModel.bookedQuantity({
                event: booking.event
              })
            })
            .then(function (res) {
              if (booking.quantity > activity.getChild(booking.event).quantity - res.quantity)
                throw new Error("There are not enough events available for booking");
            })
        );

      });

      return Q.all(checkAvailableBookings);
    }).then(function () {

      return booking.save();

    }).then(function () {

      // init profile
      booking.profile.firstName = params.profile.firstName;
      booking.profile.lastName = params.profile.lastName;
      booking.profile.email = params.profile.email;
      booking.profile.tel = params.profile.tel;

      booking.payment.amount_int = params.payment.amount_int;
      booking.payment.currency = params.payment.currency;

      if (req.user) {  // user is loggedin save the user
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

              // todo quantity calculation
              /*
               _.forEach(params.bookings, function(booking) {
               // check if is avaiable
               var quantity_total;
               models.ActivityModel.get(ObjectId(booking.activity))
               .then(function(activity) {
               quantity_total = activity.getChild(booking.event).quantity;

               return models.BookedEventModel.bookedQuantity({event : booking.event});
               })
               .then(function(bookedEvents) {
               var quantity_booked = bookedEvents.quantity;
               var quantity_availabe = quantity_total - quantity_booked;
               })
               // create booked event
               });
               */

              var bookedEvent = models.BookedEventModel.create();
              bookedEvent.booking.setObject(booking);
              bookedEvent.activity.setObject(activity);
              bookedEvent.item._link = ObjectId(bookingEvent.item);
              bookedEvent.event._link = ObjectId(bookingEvent.event);

              bookedEvent.quantity = bookingEvent.quantity;

              //bookedEvent.activityCopy = activity;  // kopie der orginal-daten
              return bookedEvent.save();
            })
        );

      });

      return Q.all(bookingPromises);
    })
    .then(function () {
      return {
        state: "ok",
        bookingId: booking._id
      };
    })
    .fail(function (err) {
      console.error(err);
      return {
        state: "err",
        error: err.message
      };
    });
});


