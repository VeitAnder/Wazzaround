var Q = require('q');
var ObjectId = require('mongojs').ObjectId;

var models = require('../models/models.js');


// setup filters for the UserModel
models.UserModel.readFilter(function(req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow read operations
  }

  return {_id : ObjectId(req.session.user) };  // filter for only your documents (your user id)
});

models.UserModel.writeFilter(function(userObj, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // allow the user to save his own User Object
  if (userObj._id == req.session.user) {
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
        req.session.user = users[0]._id;
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
  delete req.session.user;
});