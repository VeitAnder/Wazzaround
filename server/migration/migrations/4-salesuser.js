module.exports.id = "saleuser";

var config = require("../mm-config.js");
var Q = require("Q");
var _ = require("lodash");

var CryptoJS = require("crypto-js");

var modelizer = require('modelizer');
var models = require("../../models/models.js");
var mongojs = require('mongojs');
// init a mongodb database connection
if (config.local) {
  var db = mongojs('mongodb://127.0.0.1:27017/' + config.db);
} else {
  var db = mongojs('mongodb://' + config.user + ":" + config.password + "@" + config.host + ':' + config.port + '/' + config.db);
}
// tell modelizer to use this connection to store the models
var connector = modelizer.MongoConnector(db);  // get a mongodb database connector

module.exports.up = function (done) {
  models.UserModel.connection(connector);
  models.UserModel.all()
    .then(function (users) {
      var promises = [];
      users.forEach(function (user) {
        if (user.userType === "admin") {
          user.acl.sales = true;
        } else {
          user.acl.sales = false;
        }
        promises.push(user.save());
      });
      return Q.all(promises);
    }).then(function () {
      done();
    })
    .done();
};
