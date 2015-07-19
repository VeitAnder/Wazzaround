/**
 * Created by jonathan on 20.03.14.
 */


//var config = require('../../config.js');
var ObjectId = require('mongojs').ObjectId;

var models = require('../models.js');
var ActivityModel = require('../models.js').ActivityModel;

var Q = require('q');
var _ = require('lodash');

var translationutil = require('../../lib/translation');

///////////////////////
// read/write filters

ActivityModel.readFilter(function (req) {
  // allow global read access

  // authorized users
  if (req.isAuthenticated()) {
    if (req.user.userType === 'user') {
      return {
        published: true
      };
    }

    if (req.user.userType === 'provider') {
      return {
        "$or": [
          {"published": true},
          {"owner._reference": req.user._id}
        ]
      };
    }

    if (req.user.userType === 'admin') {
      return true;  // kann alles lesen
    }

    return false;  //der rest (sollte nicht passieren) kann nix lesen
  }
  // end authorized users

  // für nicht eingeloggt user:
  return {
    published: true
  };  //filter published Activities

});

ActivityModel.afterReadFilter(function (obj) {
  // berechne die verfügbare quantity

  var promises = [];

  _.forEach(obj.bookableItems, function (item) {
    _.forEach(item.events, function (event) {

      promises.push(
        models.BookedEventModel.find({"event._link": event._id})  // find alle Buchungen zu einem Event
          .then(function (bookedEvents) {
            var bookedQuantity = 0;
            _.forEach(bookedEvents, function (bookedEvent) {
              bookedQuantity += bookedEvent.quantity;
            });

            event.availableQuantity = event.quantity - bookedQuantity;
          })
      );

    });
  });

  return Q.all(promises);  // wait until all promises resolved
});

// TODO: das ist nur so kompliziert, weil delete das doc aus der datenbank hohlt...
ActivityModel.writeFilter(function (doc, req) {
  var ownerRef;

  if (!req.isAuthenticated()) {
    return false;  // if not logged in don't allow write operations
  }

  // admin is allowed to publish activity
  if (req.user.userType === 'admin') {
    // set owner to current user

    if (!doc.owner._reference) {  // prevent admin from stealing ownership
      doc.owner._reference = req.user._id;

    } else { // todo: bug beim speichern von _references: wird als string statt object gespeichert!! :-(

      ownerRef = doc.owner._reference;
      if (!(doc.owner._reference instanceof ObjectId)) { // workaround for delete
        ownerRef = ObjectId(ownerRef);
      }

      doc.owner._reference = ownerRef;
    }
    // allow global access to admin-user
  }
  else {
    ownerRef = doc.owner._reference;
    if (doc.owner._reference instanceof ObjectId) { // workaround for delete
      ownerRef = ownerRef.toString();
    }

    // don't allow to save activities where the user is not the owner
    if (doc._id !== undefined && ownerRef !== req.user._id.toString()) {
      return false;
    }

    // set the owner of the activity
    doc.owner._reference = req.user._id;
  }

  var translateBookableItems = function (bookableItems) {
    var translationPromises = [];
    _.forEach(bookableItems, function (bookableitem) {
      translationPromises.push(translationutil.translate(bookableitem.description, doc.inputlanguage));
    });
    return translationPromises;
  };

  // translate the activity before writing document
  return Q.all(_.flatten([
    translationutil.translate(doc.name, doc.inputlanguage),
    translationutil.translate(doc.description, doc.inputlanguage),
    translationutil.translate(doc.shortdescription, doc.inputlanguage),
    translateBookableItems(doc.bookableItems)
  ]))
    .fail(function (err) {
      return err;
    });

});

///////////////////////
// Operation Impl.

ActivityModel.factoryImpl("getMyActivities", function (params, req) {
  if (!req.isAuthenticated()) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.find({
    'owner._reference': req.user._id
  });
});

ActivityModel.factoryImpl("filteredActivities", function (params, req) {

  console.log("filteredActivities()", params);

  if (!params.from || !params.to || !params.startDate || !params.endDate) {
    console.log("Missing some parameters", params);
    return;
  }

  var startDate = new Date(params.startDate);
  var endDate = new Date(params.endDate);

  return models.ActivityModel.find({
    location: {
      '$geoWithin': {
        '$box': [
          [params.from.lng, params.from.lat],
          [params.to.lng, params.to.lat]
        ]
      }
    }
  })
    .then(function (activities) {
      console.log("activities", activities);
      activities.forEach(function (activity) {
        activity.bookableItems = [];
      });

      return activities;
    });
});

ActivityModel.factoryImpl("byOwner", function (params, req) {
  if (!req.isAuthenticated()) {
    return false;  // if not logged operation not allowed
  }
  if (req.user.userType !== 'admin') {
    return false;
  }

  return models.ActivityModel.find({
    'owner._reference': ObjectId(params.id)
  });
});
