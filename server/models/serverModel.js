var Q = require('q');
var moment = require('moment');
var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models/models.js');

models.ActivityModel.readFilter(function (req) {
  // allow global read access

  if (req.session.auth) {  // if logged in
    return true;  // allow global read access
  }

  return {published:true};  //filter published Activities
  //return true;
});

models.ActivityModel.writeFilter(function (doc, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  if (req.session.user.userType === 'admin') {
    doc.owner._reference = ObjectId(req.session.user._id);
    return true;  // allow global access to admin-user
  }

  // don't allow to save activities where the user is not the owner
  if (doc._id !== undefined && doc.owner._reference !== req.session.user._id) {
    return false;
  }

  // set the owner of the activity
  doc.owner._reference = ObjectId(req.session.user._id);
  return true;
});


models.ActivityModel.factoryImpl("getMyActivities", function (params, req) {
  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.find({'owner._reference': ObjectId(req.session.user._id)});
});


models.ActivityModel.factoryImpl("getActivitiesFilterByTime", function (params, req) {
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

var token = require('token.js');
var mail = require('../lib/mail.js');
models.AccesstokenModel.operationImpl("sendReactivation", function (params, req) {
  var tokenObj = models.AccesstokenModel.create();
  tokenObj.token = token(32);
  tokenObj.expires = moment().add('days', 1).toDate();

  return models.UserModel.find({ email: params.email })
    .then(function (users) {
      console.log("GOT USERS", users);
      if (users.length !== 1) {
        throw new Error("User not found");
      }
      return users[0];
    })

    .then(function (user) {
      tokenObj.user.setObject(user);
      tokenObj.save();
      return tokenObj;
    })

    .then(function (tokenObj) {
      return mail.sendResetPasswordMail(tokenObj.user.ref(), tokenObj.token);
    })

    .then(function () {
      return { "status": "OK" };
    });

});

models.AccesstokenModel.operationImpl("setNewPassword", function (params, req) {

  // got token and user email and pwd in params
  return models.AccesstokenModel.find({ token: params.token })
    .then(function (tokenObjs) {
      console.log("Found token Objs for provided token", tokenObjs);
      if (tokenObjs.length !== 1) {
        throw new Error("No tokens found for token id", params.token);
      }
      return tokenObjs[0];
    })

    .then(function (tokenObj) {
      console.log("Found one tokenObj", tokenObj);
      // check expiration date, if it's today or before, its already expired
      if (moment(tokenObj.expires).isBefore(new Date(), 'day')) {
        throw new Error("This token has expired and cannot be used for setting a new password", tokenObj);
      }
      return tokenObj.user.load();
    })

    .then(function (user) {
      console.log("Found user", user);
      // token validieren ob es für diesen user ist
      if (user.email === params.email) {
        // reset password
        user.password = params.password;
        return user.save();
      } else {
        throw new Error("Authorization went wrong, accesstoken and user dont match");
      }
    })

    .then(function () {
      console.log("AFTER SAVING USER");
      // remove accesstoken after setting new password
//      return models.AccesstokenModel.remove({ token: params.token });    TODO  Jonathan fragen warum das nicht geht
//    })

//    .then(function () {
//      console.log("AFTER ALL DONE");
      return { "status": "OK" };
    });
});


