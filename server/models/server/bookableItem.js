/**
 * Created by jonathan on 19.03.14.
 */

var Q = require('q');
var moment = require('moment');
moment.lang('en');

var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models.js');
var BookableItemModel = require('../models.js').BookableItemModel;



///////////////////////
// read/write filters

BookableItemModel.readFilter(function(req) {
  return true;  // allow global read
});

BookableItemModel.writeFilter(function (doc, req) {
  return false;  // only server is allowed to make changes
});



///////////////////////
// Operation Impl.


BookableItemModel.operationImpl("saveWithRepeatingEvents", function (params, req) {
  //TODO: muss zum bestehenden objekt hinzugefügt werden...

  // todo auth
  var deferred = Q.defer();

  console.log("saveWithRepeatingEvents called");

  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  if (typeof params.obj != 'object') {
    deferred.reject(new Error("no 'obj' parameter"));
    return deferred.promise;
  }

  var obj = params.obj;

  //console.log('obj', obj);

  var createEventSeries = function (item, obj) {

    item.description = obj.description;
    item.price = obj.price;
    item.events = [];

    _.forEach(obj.events, function (event) {
      // copy the 'first' event
      item.events.push({
        start: new Date(event.start),
        duration: event.duration,
        quantity: event.quantity
      });
    });

    _.forEach(obj.events, function (event) {

      if (event.repeating !== undefined && event.repeating === true) {

        var startDate = moment(event.start); //moment();
        var duration = event.duration;
        var quantity = event.quantity;
        var endDate = moment(event.end).hour(23).minute(59);  //moment().add('days', 14);

        if (moment().subtract('days', 1) > startDate) {
          console.log("you're trying to add events in the past");
          deferred.reject(new Error("you're trying to add events in the past"));
          return deferred.promise;
        }

        if (endDate.diff(startDate, 'years') > 2) {
          console.log("you're trying to add events for more than two years");
          deferred.reject(new Error("you're trying to add events for more than two years"));
          return deferred.promise;
        }

        startDate.add('days', 1);  // start Date + 1

        while (startDate <= endDate) {
          // add new event
          if (event.dayOfWeek[startDate.format('ddd')]) {  // Wochentag angehakt
            console.log('Create Event at: ', startDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));
            item.events.push({
              start: new Date(startDate.toDate()),
              duration: duration,
              quantity: quantity
            });
          }
          startDate.add('days', 1);
        }

      }
    });

    //console.log("save", item);

    return item.save()
      .then(function (item) {
        return { _id: item._id };
      });
  }

  if (obj._id != undefined) {  // es exisiert schon ein BoockAble-Item
    console.log("get existing item");
    return BookableItemModel.get(ObjectId(obj._id))
      .then(function (item) {
        console.log("existing item", item);

        return createEventSeries(item, obj);
      });
  } else {
    console.log("create new item");
    var item = BookableItemModel.create();  // create new item

    item.owner._reference = ObjectId(req.session.user._id);

    return createEventSeries(item, obj);
  }

});
