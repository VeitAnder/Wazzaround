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

    if (req.session.user.userType === 'user') {
      return {published: true};
    }

    if (req.session.user.userType === 'provider') {
      return {
        "$or": [
          { published: true },
          { "owner._reference": ObjectId(req.session.user._id) }
        ]
      };
    }

    if (req.session.user.userType === 'admin') {
      return true;  // kann alles lesen
    }

    return false;  //der rest (sollte nicht passieren) kann nix lesen
  }

  // für nicht eingeloggt user:
  return {published: true};  //filter published Activities
});

// TODO: das ist nur so kompliziert, weil delete das doc aus der datenbank hohlt...
ActivityModel.writeFilter(function (doc, req) {
  var ownerRef;

  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // admin is allowed to publish activity
  if (req.session.user.userType === 'admin') {
    // set owner to current user

    if (!doc.owner._reference) {  // prevent admin from stealing ownership
      doc.owner._reference = ObjectId(req.session.user._id);

    } else { // todo: bug beim speichern von _references: wird als string statt object gespeichert!! :-(

      ownerRef = doc.owner._reference;
      if (!(doc.owner._reference instanceof ObjectId)) { // workaround for delete
        ownerRef = ObjectId(ownerRef);
      }

      doc.owner._reference = ownerRef;
    }

    return true;  // allow global access to admin-user
  }

  ownerRef = doc.owner._reference;
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

ActivityModel.factoryImpl("filteredActivities", function (params, req) {

  if (!params.from || !params.to) {
    console.log("Missing some parameters", params);
    return;
  }

  if (params.startDate && params.endDate) {  // search with date-rage
    var startDate = new Date(params.startDate);
    var endDate = new Date(params.endDate);

    return models.ActivityModel.find({
      'longitude': {
        "$gte": params.from.longitude,
        "$lt": params.to.longitude
      },
      'latitude': {
        "$gte": params.from.latitude,
        "$lt": params.to.latitude
      },
      bookableItems: {
        $elemMatch: {
          events: {
            $elemMatch: {
              start: {
                '$gt': startDate,
                '$lt': endDate
              }
            }
          }
        }
      }
    });
  }

  return models.ActivityModel.find({
    'longitude': {
      "$gte": params.from.longitude,
      "$lt": params.to.longitude
    },
    'latitude': {
      "$gte": params.from.latitude,
      "$lt": params.to.latitude
    }
  });

});
