var config = require('../config.js');
var passport = require('passport');
var MongoStrategy = require('./mongo-strategy');


var security = {
  initialize: function () {
    passport.use(new MongoStrategy());
  },
  passwordAuthenticationRequired: function (req, res, next) {
    var redirectParam = req.query && req.query.redirect ? "&redirect=" + req.query.redirect : "";
    if (req.query.username && req.query.password) {
      req.body.username = req.query.username;
      req.body.password = req.query.password;
    }
    if (req.isAuthenticated()) {
      next();
    } else {
      // distinguish between api calls and unauthorized resource calls
      if (req.url.indexOf(config.api.apiversion) > -1) {
        return res.send(401);
      } else {
        return res.redirect("/#/login?error=usernotloggedin" + redirectParam);
      }
    }
  },
  sendCurrentUser: function (req, res, next) {
    console.log("sendCurrentUser");
    res.json(200, req.user);
  },

  login: function (req, res, next) {

    function authenticationFailed(err, user, info) {
      console.log("authentication Failed");
      if (err) {
        return next(err);
      }
    }

    console.log("login");
    return passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next);




  },

  logout: function (req) {
    req.logout();
    return {};
  }
};

module.exports = security;