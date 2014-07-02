/**
 * Created by jonathan on 18.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

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

var PAYMILL_PRIVATE_KEY = '6d75d460894efb64f30a9f0307980052';
var paymill = require('paymill-node')(PAYMILL_PRIVATE_KEY);

// run payment with paymill-backend
var pay = function (bookingObj, paymentToken, amount_int) {
  console.log("in pay()");

  var defer = Q.defer();

  // Neues Zahlungsmittel anlegen
  paymill.payments.create(
    {
      token: params.paymentToken
    },
    function (err, payment) {
      if (err) {
        console.log("Couldn't create the payment record");
        defer.reject(err);
        return;
      }
      console.log("payment", payment.data);

      // Eine Zahlung einleiten
      paymill.transactions.create(
        {
          amount: amount_int,
          currency: 'EUR',
          payment: payment.data.id,
          description: 'Payment from: ' + bookingObj.profile.lastName + ', ' + bookingObj.profile.firstName
        },
        function (err, transaction) {
          if (err) {
            console.log("Couldn't create the transaction record");
            defer.reject(err);
            return;
          }
          console.log("transaction successfull");
          console.log("transaction", transaction.data);
          // TODO: save transaction_id as bookingId to bookingObj
          defer.resolve();
        }
      );

    }
  );

  return defer.promise;
};

BookingModel.operationImpl("checkout", function (params, req) {
  console.log("In checkout()", params);

  assert(params.bookings && Array.isArray(params.bookings), "you need to provide a bookings-array");
  assert(params.payment, "you need to provide payment informations");
  assert(params.profile, "you need to provide a profile");

  var booking = BookingModel.create();

  return booking.save()
    .then(function() {

      // init profile
      booking.profile.firstName = params.profile.firstName;
      booking.profile.lastName = params.profile.lastName;
      booking.profile.email = params.profile.email;
      booking.profile.tel = params.profile.tel;

      if (req.session.user) {  // user is loggedin save the user
        booking.user._reference = ObjectId(req.session.user._id);
      }

      // perform payment
      return pay(booking, params.paymentToken, params.amount_int)
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
              return model.ActivityModel.get(ObjectId(bookingEvent.activity));
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

              var bookedEvent = model.BookedEventModel.create();
              bookedEvent.booking.setObject(booking);
              bookedEvent.activity.setObject(activity);
              bookedEvent.item._link = ObjectId(bookingEvent.item);
              bookedEvent.event._link = ObjectId(bookingEvent.event);

              bookedEvent.activityCopy = activity;  // kopie der orginal-daten
              return bookedEvent.save();
            })
        );

      });

      return Q.all(bookingPromises);
    })
    .then(function () {
      return {state: "ok"};
    })
    .fail(function(err) {
      return {
        state: "err",
        error: err
      };
    });
});


