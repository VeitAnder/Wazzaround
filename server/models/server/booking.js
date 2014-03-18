/**
 * Created by jonathan on 18.03.14.
 */

var Q = require('q');
var moment = require('moment');
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
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  return { "owner._reference" : req.session.user_id };
});

BookingModel.writeFilter(function (obj, req) {
  return false;  // only server is allowed to make changes
});


///////////////////////
// Operation Impl.

BookingModel.operationImpl("buy", function (params, req) {
  var checkAvailability = function(booking) {
    return models.BookableItemModel.get(ObjectId(booking.item))
      .then(function(item){
        var event = _.find(item.events, function(event) { return event.start.toISOString() === booking.start; });
        if (event === undefined) return Q.reject("Event not found");
        if (event.quantity < booking.quantity) return Q.reject("Not enough booked items available");
        return Q.resolve(item);
      });
  };

  assert(Array.isArray(params.bookings));

  Q()
    .then(function(){
      var availablePromises = [];
      _.forEach(params.bookings, function(booking){
        // 1. is Available
        assert(booking.activity && booking.item && booking.start &&  booking.quantity);

        availablePromises.push(checkAvailability(booking));
      });

      return Q.all(availablePromises);  // wait until all promises are settled
    })
    .then(function(items){
      console.log("items", items);

      var savePromises = [];
      _.forEach(items, function(item) {
        var booking = _.find(params.bookings, function(booking){ return booking.item == item._id.toString(); });
        var event = _.find(item.events, function(event) { return event.start.toISOString() === booking.start; });
        event.quantity -= booking.quantity; // decrement

        savePromises.push(item.save());  // 2. save decrement

        // 3. add to booking
        var bookingObj = BookingModel.create();

        bookingObj.activity._reference = ObjectId(booking.activity);
        bookingObj.item.setObject(item);
        bookingObj.start = new Date(booking.start);
        bookingObj.quantity = booking.quantity;

        bookingObj.owner = item.owner;

        savePromises.push(bookingObj.save());
      });

      return Q.all(savePromises);
    })
    .fail(function(err){
      console.log("err", err);
      // throw err;
    });


  // 4. later: payment

});