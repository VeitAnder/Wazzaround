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

BookingModel.readFilter(function(req) {
  return false;  // only server is allowed to make changes
});

BookingModel.writeFilter(function (obj, req) {
  return false;  // only server is allowed to make changes
});


///////////////////////
// Operation Impl.

BookingModel.operationImpl("checkout", function (params, req) {
  console.log("In checkout()", params);

  assert(params.bookings && Array.isArray(params.bookings), "you need to provide a bookings-array");

  var bookingPromises = [];

  _.forEach(params.bookings, function(bookingEvent) {
    assert(bookingEvent.activity, "provide an activity");
    assert(bookingEvent.item, "provide an item");
    assert(bookingEvent.event, "provide an event");
    assert(bookingEvent.quantity, "provide a quantity");

    var booking = BookingModel.create();

    if (req.session.user) {  // user is loggedin save the user
      booking.user._reference = ObjectId(req.session.user._id);
    }

    bookingPromises.push(
      Q()
        .then(function(){
          return booking.save();
        })
        .then(function() {
          return model.ActivityModel.get(ObjectId(bookingEvent.activity));
        })
        .then(function(activity) {  // get an _id

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

  Q.all(bookingPromises).then(function() {
    return {state: "ok"};
  });

});

var PAYMILL_PRIVATE_KEY = '6d75d460894efb64f30a9f0307980052';
var paymill = require('paymill-node')(PAYMILL_PRIVATE_KEY);

BookingModel.operationImpl("pay", function (params, req) {
  console.log("in pay operation");

  console.log(params);

  // Neues Zahlungsmittel anlegen
  paymill.payments.create(
    {
      token: params.paymentToken
    },
    function(err, payment) {
      if (err) {
        console.log("Couldn't create the payment record");
        return;
      }
      console.log("payment", payment.data);


      // Eine Zahlung einleiten
      paymill.transactions.create(
        {
          amount: parseInt(params.ammount),
          currency: 'EUR',
          payment: payment.data.id,
          description: 'Test Transaction'
        },
        function(err, transaction) {
          if (err) {
            console.log("Couldn't create the transaction record");
            console.log(err);
            return;
          }
          console.log("transaction successfull");
          console.log("transaction", transaction.data);
        }
      );

    }
  );

});