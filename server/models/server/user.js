/**
 * Created by jonathan on 20.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;

var models = require('../models.js');
var UserModel = require('../models.js').UserModel;



///////////////////////
// read/write filters

// setup filters for the UserModel
UserModel.readFilter(function (req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow read operations
  }

  return {_id: ObjectId(req.session.user._id) };  // filter for only your documents (your user id)
});

UserModel.writeFilter(function (userDoc, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // allow the user to save his own User Object
  if (userDoc._id === req.session.user._id) {
    return true;
  }

  return false;  // else: filter failed -> access denied
});



///////////////////////
// Operation Impl.



// setup Operations for the model to register an user
UserModel.operationImpl("register", function (params, req) {
  var user = models.UserModel.create();
  user.email = params.email.toLowerCase();
  user.password = params.password;
  if (params.profile) {
    for (var i in params.profile) {
      user.profile[i] = params.profile[i];
    }
    //user.profile = params.profile;
  }
  // set userType if provided
  // todo: check validity of userType by checking other required fields e.g. of userType provider
  if (params.userType){
    user.userType = params.userType;
  }

  // save the new user
  return Q()
    .then(function () {
      if (params.email === undefined || params.email === "") {
        throw new Error("You have to provide a E-Mail address");
      }

      return models.UserModel.find({email: params.email});  // find all existing users
    })
    .then(function (users) {
      if (users.length > 0) {
        throw new Error("User already exists");
      }
      return user.save();  // save the new user
    })
    .then(function () {  // if save was ok
      return {status: "ok"};
    });
});

// a operation to login a user
UserModel.operationImpl("login", function (params, req) {
  if(!params.email || !params.password) throw new Error("No User/Password provided!");

  return UserModel.find({email: params.email.toLowerCase()})  // find this user
    .then(function (users) {
      if (users.length < 1) throw new Error("User not found");
      if (users.length > 1) throw new Error("Found more then one user");

      if (users[0].password === params.password) { // auth successful
        // remember in a session, that auth was successful
        req.session.auth = true;
        // remeber the user in the session
        req.session.user = users[0];
        return users[0];
      } else {
        throw new Error('Invalid Password');
      }
    })
    .then(function (user) {  // store last login date
      user.lastlogindate = new Date();
      return user.save();
    })
    .then(function () {  // if login was ok
      return {status: "ok"};
    });
});

// logout
UserModel.operationImpl("logout", function (params, req) {
  delete req.session.auth;
  delete req.session.user;
});

UserModel.factoryImpl("currentUser", function (params, req) {
  var deferred = Q.defer();
  if (!req.session.auth) {
    var err = new Error("no authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  }

  //return models.UserModel.get(ObjectId(req.session.user_id));
  return UserModel.find({ _id: ObjectId(req.session.user._id)})
    .then(function (users) {
      console.log("users", users);
      if (users.length !== 1) throw new Error("User not found");
      return users[0];
    });
});

