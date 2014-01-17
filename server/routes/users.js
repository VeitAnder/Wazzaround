var restify = require('restify');
var Q = require('q');

var Users = require('../models/model_users.js');
var usermanager = require('../lib/usermanager.js');

/*
 define route hanndlers
 */

exports.findById = function (req, res, next) {
  if (req.params.id.toString() === req.user._id.toString()) {
    Users.findOneQ({
      _id: req.params.id
    })
      .then(function (user) {
        if (user === null) {
          Q.reject(new restify.errors.ResourceNotFoundError("Could not find user with id " + req.params.id));
        }
        res.send(user);
      })
      .fail(function (err) {
        next(err);
      })
      .done();

  } else {
    next(new restify.errors.NotAuthorizedError("User id " + req.user._id + " not allowed to access userdata of user with id " + req.params.id));
  }
};

exports.setpassword = function (req, res, next) {
  console.log("req.params", req.params);

  //user can only set his own password
  if (req.params.id.toString() === req.user._id.toString()) {
    usermanager.setPassword(req.user.email, req.body.password)
      .then(function (user) {
        if (user === null) {
          next(new restify.errors.ResourceNotFoundError("Could not find user with id " + req.params.id));
        }
        res.send(user);
      }, function (err) {
        next(err);
      })
      .done();

  } else {
    next(new restify.errors.NotAuthorizedError("User id " + req.user._id + " not allowed to access userdata of user with id " + req.params.id));
  }
};

// TODO it is possible to send an empty profile so that firstName/lastName are also empty!
// TODO it is possible to send a fake profile like { profile : "asdf" }
exports.updateProfile = function (req, res, next) {
  //user can only update his own profile
  if (req.params.id.toString() === req.user._id.toString()) {
    usermanager.updateProfile(req.user.email, req.body.profile)
      .then(function (user) {
        if (user === null) {
          next(new restify.errors.ResourceNotFoundError("Could not find user with id " + req.params.id));
        }
        res.send(user);
      }, function (err) {
        next(err);
      })
      .done();

  } else {
    next(new restify.errors.NotAuthorizedError("User id " + req.user._id + " not allowed to access userdata of user with id " + req.params.id));
  }
};