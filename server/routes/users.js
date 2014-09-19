var express = require('express');
var router = express.Router();

var Q = require('q');

var models = require("../models/models.js");
var ObjectId = require('mongojs').ObjectId;

//var security = require("../lib/security.js");
//router.use(security.isAuthenticated);

router.get('/:id/activate/:tokenid/:token/', function (req, res, next) {
  models.AccesstokenModel.get(ObjectId(req.params.tokenid))
    .then(function (accesstoken) {
      if (accesstoken.token === req.params.token) {
        return accesstoken.user.load();
      } else {
        return Q.reject(new Error("Provided token is not valid."));
      }
    })
    .then(function (user) {
      user.emailconfirmed = true;
      return user.save();
    })
    .then(function (user) {
      res.send(user);
    })
    .fail(function (err) {
      res.send(err.message);
    })
    .done();
});

module.exports = router;