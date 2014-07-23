/**
 * Created by jonathan on 23.04.14.
 */

var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var BookedEventModel = require('../models.js').BookedEventModel;

function assert(condition, message) {
  if (!condition) {
    console.log('Assertion failed', message);
    console.trace();
    throw message || "Assertion failed";
  }
}

///////////////////////
// read/write filters

BookedEventModel.readFilter(function (req) {
  return false;  // only server is allowed to make changes
});

BookedEventModel.writeFilter(function (obj, req) {
  return false;  // only server is allowed to make changes
});

///////////////////////
// Operation Impl.

/*
 *  bookedQuantity : Operation({    // wie oft wurde das Event gebucht
 *    event : Attr(Type.objectid)
 *  })  // returns { quantity : X }
 */
BookedEventModel.operationImpl("bookedQuantity", function (params, req) {
  assert(params.event, "event missing");

  return BookedEventModel.find({"event._link": ObjectId(params.event)})  // find alle Buchungen zu einem Event
    .then(function (events) {
      var quantity = 0;
      _.forEach(events, function (bookedEvent) {
        quantity += bookedEvent.quantity;
      });

      return {'quantity': quantity };
    });
});
