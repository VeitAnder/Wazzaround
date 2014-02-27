var Q = require('q');
var moment = require('moment');
var ObjectId = require('mongojs').ObjectId;

var models = require('../models/models.js');

models.ActivityModel.readFilter(function(req) {
  return true;  // allow global read access
});

models.ActivityModel.writeFilter(function(activityObj, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // don't allow to save activitys where the user is not the owner
  if (activityObj._id != undefined && activityObj.owner._reference != req.session.user_id) {
    return false;
  }

  // set the owner of the activity
  activityObj.owner = { _reference : req.session.user_id };
  return true;
});

// setup filters for the UserModel
models.UserModel.readFilter(function(req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow read operations
  }

  return {_id : ObjectId(req.session.user_id) };  // filter for only your documents (your user id)
});

models.UserModel.writeFilter(function(userObj, req) {
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
models.UserModel.operationImpl("register", function(params, req) {
  var user = models.UserModel.create();
  user.username = params.username;
  user.password = params.password;

  // save the new user
  return Q()
    .then(function() {
      if (params.username == undefined || params.username == "") {
        throw new Error("You have to provide a E-Mail address");
      };

      return models.UserModel.find({username:params.username});  // find all existing users
    })
    .then(function(users) {
      if (users.length > 0 ) throw new Error("User already exists");
      return user.save();  // save the new user
    })
    .then(function() {  // if save was ok
      return {status:"ok"};
    });
});


// a operation to login a user
models.UserModel.operationImpl("login", function(params, req) {
  return models.UserModel.find({username:params.username})  // find this user
    .then(function(users) {
      if (users.length < 1) throw new Error("User not found");
      if (users.length > 1) throw new Error("Found more then one user");

      if (users[0].password == params.password) { // auth successfull
        // remember in a sesson, that auth was sucessfull
        req.session.auth = true;
        // remember the user in the sesson
        req.session.user_id = users[0]._id;
      } else {
        throw new Error('Invalid Password');
      }
    })
    .then(function() {  // if login was ok
      return {status:"ok"};
    });
});


// logout
models.UserModel.operationImpl("logout", function(params, req) {
  delete req.session.auth;
  delete req.session.user_id;
});


models.UserModel.factoryImpl("currentUser", function(params, req) {
  var deferred = Q.defer();
  if (!req.session.auth) {
    var err = new Error("no authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  }
  //return models.UserModel.get(ObjectId(req.session.user_id));
  return models.UserModel.find({ _id: ObjectId(req.session.user_id)})
    .then(function(users){
      if (users.length !== 1) throw new Error("User not found");
      return users[0];
    });
});



models.ActivityModel.factoryImpl("getMyActivities", function(params, req) {
  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.find({'owner._reference' : req.session.user_id});
});


models.BookableItemModel.operationImpl("saveWithRepeatingEvents", function(params, req) {
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

  var item = models.BookableItemModel.create();

  item.description = obj.description;
  item.price = obj.price;

  var startDate = moment(obj.events[0].start); //moment();
  var duration = obj.events[0].duration;
  var quantity = obj.events[0].quantity;
  var endDate = moment(obj.events[0].end); //moment().add('days', 14);

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


  while (startDate <= endDate) {
    // add new event
    if (obj.events[0].dayOfWeek[startDate.format('ddd')]) {  // Wochentag angehakt
      console.log('Create Event at: ', startDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      item.events.push({
        start : startDate.toDate(),
        duration : duration,
        quantity : quantity
      });
    }
    startDate.add('days', 1);
  }

  return item.save()
    .then(function() {
      // return nothing
    });
});
