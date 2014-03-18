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

models.ActivityModel.writeFilter(function (activityObj, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  if (req.session.user.userType === 'admin') {
    return true;  // allow global access to admin-user
  }

  // don't allow to save activitys where the user is not the owner
  if (activityObj._id !== undefined && activityObj.owner._reference !== req.session.user_id) {
    return false;
  }

  // set the owner of the activity
  activityObj.owner = { _reference: req.session.user_id };
  return true;
});

// setup filters for the UserModel
models.UserModel.readFilter(function (req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow read operations
  }

  return {_id: ObjectId(req.session.user_id) };  // filter for only your documents (your user id)
});

models.UserModel.writeFilter(function (userObj, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // allow the user to save his own User Object
  if (userObj._id == req.session.user_id) {
    return true;
  }

  return false;  // else: filter failed -> access denied
});

// setup Operations for the model to register an user
models.UserModel.operationImpl("register", function (params, req) {
  var user = models.UserModel.create();
  user.username = params.username;
  user.password = params.password;

  // save the new user
  return Q()
    .then(function () {
      if (params.username == undefined || params.username == "") {
        throw new Error("You have to provide a E-Mail address");
      };

      return models.UserModel.find({username: params.username});  // find all existing users
    })
    .then(function (users) {
      if (users.length > 0) throw new Error("User already exists");
      return user.save();  // save the new user
    })
    .then(function () {  // if save was ok
      return {status: "ok"};
    });
});

// a operation to login a user
models.UserModel.operationImpl("login", function (params, req) {
  return models.UserModel.find({username: params.username})  // find this user
    .then(function (users) {
      if (users.length < 1) throw new Error("User not found");
      if (users.length > 1) throw new Error("Found more then one user");

      if (users[0].password == params.password) { // auth successful
        // remember in a session, that auth was successful
        req.session.auth = true;
        // remember the user in the sesson
        req.session.user_id = users[0]._id;
        // remeber the user in the session
        req.session.user = users[0];
      } else {
        throw new Error('Invalid Password');
      }
    })
    .then(function () {  // if login was ok
      return {status: "ok"};
    });
});

// logout
models.UserModel.operationImpl("logout", function (params, req) {
  delete req.session.auth;
  delete req.session.user_id;
});

models.UserModel.factoryImpl("currentUser", function (params, req) {
  var deferred = Q.defer();
  if (!req.session.auth) {
    var err = new Error("no authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  }
  //return models.UserModel.get(ObjectId(req.session.user_id));
  return models.UserModel.find({ _id: ObjectId(req.session.user_id)})
    .then(function (users) {
      if (users.length !== 1) throw new Error("User not found");
      return users[0];
    });
});

models.ActivityModel.factoryImpl("getMyActivities", function (params, req) {
  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.find({'owner._reference': req.session.user_id});
});

models.BookableItemModel.operationImpl("saveWithRepeatingEvents", function (params, req) {
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

  console.log('obj', obj);

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

    console.log("save", item);

    return item.save()
      .then(function (item) {
        return { _id: item._id };
      });
  }

  if (obj._id != undefined) {  // es exisiert schon ein BoockAble-Item
    console.log("get existing item");
    return models.BookableItemModel.get(ObjectId(obj._id))
      .then(function (item) {
        console.log("existing item", item);

        return createEventSeries(item, obj);
      });
  } else {
    console.log("create new item");
    var item = models.BookableItemModel.create();  // create new item

    return createEventSeries(item, obj);
  }

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

  return models.UserModel.find({ username: params.email })
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
      if (user.username === params.email) {
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


