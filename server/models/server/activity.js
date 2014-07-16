/**
 * Created by jonathan on 20.03.14.
 */


var config = require('../../config.js');
var ObjectId = require('mongojs').ObjectId;

var models = require('../models.js');
var ActivityModel = require('../models.js').ActivityModel;

var q = require('Q');

var googleTranslate = require('google-translate')(config.google.apikey);

///////////////////////
// read/write filters

ActivityModel.readFilter(function (req) {
  // allow global read access
  console.log("read filter");

  // authorized users
  if (req.user) {
    console.log("read filter");
    if (req.user.userType === 'user') {
      return {
        published: true
      };
    }

    if (req.user.userType === 'provider') {
      return {
        "$or": [
          { "published": true },
          { "owner._reference": req.user._id }
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

//ActivityModel.postReadFilter(function (req, obj) {
//
//  return obj;
//});

var translateActivity = function (doc) {
  var deferred = q.defer();

  console.log("inputlanguage", doc.inputlanguage);

  googleTranslate.translate(doc.name[doc.inputlanguage], doc.inputlanguage, 'en', function (err, translation) {
    console.log(translation);
    doc.name.en = translation.translatedText;
    deferred.resolve(doc);
  });

  return deferred.promise;
};

// TODO: das ist nur so kompliziert, weil delete das doc aus der datenbank hohlt...
ActivityModel.writeFilter(function (doc, req) {
  var ownerRef;

  if (!req.user) {
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
      ownerRef = ownerRef;
    }

    // don't allow to save activities where the user is not the owner
    if (doc._id !== undefined && ownerRef !== req.user._id) {
      return false;
    }

    // set the owner of the activity
    doc.owner._reference = req.user._id;
  }

  // translate the activity
//  return q.all([
//    translateActivity(doc)
//  ]);
//

  return translateActivity(doc)
    .then(function (translateddoc) {
      doc = translateddoc;
      console.log("doc", doc);
      return true;
    });

});

///////////////////////
// Operation Impl.

ActivityModel.factoryImpl("getMyActivities", function (params, req) {
  if (!req.user) {
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

  return models.ActivityModel.filtered_findQ({
      location: {
        '$geoWithin': {
          '$box': [
            [ params.from.lng, params.from.lat ],
            [ params.to.lng, params.to.lat ]
          ]
        }
      },
      bookableItems: {
        $elemMatch: {
          events: {
            $elemMatch: {
              start: {
                '$gte': startDate,
                '$lte': endDate
              }
            }
          }
        }
      }
    },
    req);
  /*.then(function(activities) {

   var events = [];
   _.forEach(activities, function(activity) {
   _.forEach(activity.bookableItems, function(item) {
   _.forEach(item.events, function(event) {
   events.push(event);
   });
   });
   });

   var bookQuantityPromises = [];
   _.forEach(events, function(event) {
   bookQuantityPromises.push(
   models.BookedEventModel.bookedQuantity({event: event._id})
   .then(function(bookedEvent) {
   event.bookQuantity = event.quantity - bookedEvent.quantity;
   })
   );
   });

   return Q.all(bookQuantityPromises)  // wait for all changes..
   .then(function() {
   return activities;
   })
   });*/
});
