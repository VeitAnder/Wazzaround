var Q = require('q');
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
  var user = models.UserModel.createObject();
  user.username = params.username;
  user.password = params.password;

  // save the new user
  return Q()
    .then(function() {
      if (params.username == undefined || params.username == "") {
        throw new Error("You have to provide a E-Mail address");
      };

      return models.UserModel.use.find({username:params.username});  // find all existing users
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
  return models.UserModel.use.find({username:params.username})  // find this user
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
  //return models.UserModel.use.get(ObjectId(req.session.user_id));
  return models.UserModel.use.find({ _id: ObjectId(req.session.user_id)})
    .then(function(users){
      if (users.length != 1) throw new Erorr("User not found");
      return users[0];
    });
});



models.ActivityModel.factoryImpl("getMyActivities", function(params, req) {
  if (!req.session.auth) {
    return false;  // if not logged operation not allowed
  }

  return models.ActivityModel.use.find({'owner._reference' : req.session.user_id});
});

