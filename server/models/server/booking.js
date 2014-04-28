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
  assert(params.bookings && Array.isArray(params.bookings), "you need to provide a bookings-array");

  console.log("In checkout()", params);

  var bookingPromises = [];

  _.forEach(params.bookings, function(bookingEvent) {
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