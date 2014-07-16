var passport = require('passport');
var Q = require('q');
var MongoStrategy = require('./mongo-strategy');

var security = {
  initialize: function () {
    passport.use(new MongoStrategy());
  },
  login: function (req, res, next) {
    var deferred = Q.defer();
    passport.authenticate(MongoStrategy.name, function (err, user, info) {
      req.logIn(user, function (err) {
        if (err) {
          deferred.reject(err);
        }
        deferred.resolve(user);
      });
    })(req, res, next);

    return deferred.promise;
  },
  logout: function (req) {
    req.logout();
    return;
  }
};

module.exports = security;