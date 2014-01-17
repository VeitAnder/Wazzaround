var restify = require('restify');

var usermanager = require('../lib/usermanager.js');
var mail = require('../lib/mail.js');
var Users = require('../models/model_users.js');
var logger = require('../lib/logger.js');

/*
 define route hanndlers
 */

exports.add = function (req, res, next) {
  var userregistrationdata = req.body;
  var newuser;

  usermanager.isEmailAdressAvailableForLoginAccount(userregistrationdata.email)
    .then(function () {
      return usermanager.getAccount(userregistrationdata.email);
    })
    .then(function () {
      return usermanager.createLoginAccount(userregistrationdata);
    })
    .then(function (user) {
      newuser = user;
      //send confirmation link
      return mail.sendActivationTokenEmail(user);
    })
    .then(function () {
      res.send(200, {"email": newuser.email});
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.confirmuserregistration = function (req, res, next) {
  usermanager.confirmAccount(req.params.token)
    .then(function (response) {
      if (response.alreadyconfirmed) {
        res.redirect('/#/login/' + response.email + '/alreadyconfirmed/');
      } else {
        res.redirect('/#/login/' + response.email + '/confirmed/');
      }
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.forgotpassword = function (req, res, next) {
  var newpassword = Users.generatePassword();
  var emailofuser = req.body.email;
  var userAccount;

  usermanager.setPassword(emailofuser, newpassword)
    .then(function (user) {
      userAccount = user;
      return mail.sendNewPassword(user, newpassword);
    })
    .then(function () {
      res.send(200, {"email": userAccount.email});
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

/*
 to enable checks on client side for email availability
 */
exports.isEmailAdressAvailableForLoginAccount = function (req, res, next) {
  var email = req.query.email;
  if (!email) {
    next(new restify.errors.MissingParameter("URL parameter ?email= missing"));
  } else {
    usermanager.isEmailAdressAvailableForLoginAccount(email)
      .then(function () {
        res.send({email: email, isavailable: true});
      })
      .fail(function (err) { // TODO how about this cases, also use error handler? count cases like this
        logger.error("Error in checking if email address is available for login account", err);
        res.send({email: email, isavailable: false, reason: err});
      });
  }
};