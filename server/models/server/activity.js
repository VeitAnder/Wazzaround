/**
 * Created by jonathan on 20.03.14.
 */



var Q = require('q');
var moment = require('moment');
var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models.js');
var ActivityModel = require('../models.js').ActivityModel;


///////////////////////
// read/write filters


ActivityModel.readFilter(function (req) {
  // allow global read access

  if (req.session.auth) {  // if logged in
    return true;  // allow global read access
  }

  return {published:true};  //filter published Activities
  //return true;
});

// TODO: das ist nur so kompliziert, weil delete das doc aus der datenbank hohlt...
ActivityModel.writeFilter(function (doc, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // admin is allowed to publish activity
  if (req.session.user.userType === 'admin') {
    // set owner to current user

    if (!doc.owner._reference) {  // prevent admin from stealing ownership
      doc.owner._reference = ObjectId(req.session.user._id);

    } else { // todo: bug beim speichern von _references: wird als string statt object gespeichert!! :-(

      var ownerRef = doc.owner._reference;
      if (!(doc.owner._reference instanceof ObjectId)) { // workaround for delete
        ownerRef = ObjectId(ownerRef);
      }

      doc.owner._reference = ownerRef;
    }

    return true;  // allow global access to admin-user
  }

  var ownerRef = doc.owner._reference;
  if (doc.owner._reference instanceof ObjectId) { // workaround for delete
    ownerRef = ownerRef.toString();
  }


  // don't allow to save activities where the user is not the owner
  if (doc._id !== undefined && ownerRef !== req.session.user._id) {
    return false;
  }

  // set the owner of the activity
  doc.owner._reference = ObjectId(req.session.user._id);
  return true;
});



///////////////////////
// Operation Impl.


ActivityModel.factoryImpl("getMyActivities", function (params, req) {
  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.find({'owner._reference': ObjectId(req.session.user._id)});
});


ActivityModel.factoryImpl("getActivitiesFilterByTime", function (params, req) {
  console.log("getActivitiesFilterByTime called", params.activitiesIds);

  var activities = _.map(params.activitiesIds, function (el) {
    return { _id: ObjectId(el) };
  });
  var startDate = new Date(params.startDate);
  var endDate = new Date(params.endDate);
  //var activitiesIds = ["53159ee56733ddc32152606b", "53159f7a6733ddc32152606e"];
  //var activities = _.map(activitiesIds, function(el) { return {_id:ObjectId(el)};})
  //var startDate = new Date("2014-04-04T09:37:27.859Z");
  //var endDate = new Date("2010-06-18T09:37:27.859Z");

  return models.ActivityModel.find({'$or': activities})
    .then(function (activites) {
      var activitiesPromises = [];
      _.forEach(activites, function (activity) {
        var itemPromises = [];

        _.forEach(activity.bookableItems, function (item) {

          itemPromises.push(
            models.BookableItemModel.find({
              _id: ObjectId(item._reference),
              events: {
                '$elemMatch': {
                  start: {
                    '$gt': startDate,
                    '$lt': endDate
                  }
                }
              }
            })
          );
        });

        activitiesPromises.push(
          Q.all(itemPromises)
            .then(function (items) {
              var hasAResult = false;
              _.forEach(items, function (el) {
                if (Array.isArray(el) && el.length > 0) {
                  hasAResult = true;
                }
              })
              //console.log("items", items);
              //console.log("has Result", hasAResult);

              if (hasAResult) {
                return activity;
              }
            })
        );
      });

      return Q.all(activitiesPromises)
        .then(function (activities) {
          return _.filter(activities, function (el) {
            return el != undefined;
          });
        });
    });

});
