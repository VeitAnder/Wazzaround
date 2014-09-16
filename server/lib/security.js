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
      if (user) {
        req.logIn(user, function (err) {
          if (err) {
            deferred.reject(err);
          }
          deferred.resolve(user);
        });
      } else {
        deferred.reject(new Error("Invalid user credentials provided"));
      }
    })(req, res, next);

    return deferred.promise;
  },
  logout: function (req) {
    req.logout();
    return;
  },
  isAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.send(401, "Not Authorized");  // if not logged in don't allow write operations
      return;
    } else {
      next();
      return;
    }
  }
};

module.exports = security;