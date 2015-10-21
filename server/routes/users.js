var express = require('express');
var router = express.Router();
var Q = require('q');
var ObjectId = require('mongojs').ObjectId;

var models = require("../models/models.js");
var security = require('../lib/security');

//router.use(security.isAuthenticated);

router.get('/:id/activate/:tokenid/:token/', function (req, res, next) {
  var accesstoken_global;

  models.AccesstokenModel.get(ObjectId(req.params.tokenid))
    .then(function (accesstoken) {
      accesstoken_global = accesstoken;
      if (!accesstoken.isExpired()) {
        return true;
      } else {
        return Q.reject(new Error("Your accesstoken has expired."));
      }
    })
    .then(function () {
      if (accesstoken_global.token === req.params.token) {
        return accesstoken_global.user.load();
      } else {
        return Q.reject(new Error("Your accesstoken is not valid."));
      }
    })
    .then(function (user) {
      user.emailconfirmed = true;
      return user.save();
    })
    .then(function (user) {
      req.body.email = user.email;
      req.body.password = user.password;
      return security.login(req);
    })
    .then(function () {
      res.status(200).redirect("/#!/admin/myactivities/new/");
    })
    .fail(function (err) {
      res.send(err.message);
    })
    .done();
});

module.exports = router;