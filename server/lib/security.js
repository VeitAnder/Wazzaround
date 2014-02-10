/*var passport = require('passport');
var nodetime = require('nodetime');

var MongoStrategy = require('./mongo-strategy');
var BasicStrategy = require('./basic-strategy');

var usermanager = require('../lib/usermanager.js');
var tokenmanager = require('../lib/tokenmanager.js');
var config = require('../config.js');
var mail = require('../routes/mail.js'); */
var logger = require('./logger.js');

var filterUser = function (user) {
  if (user) {
    return {
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile
        //payment: user.payment
      }
    };
  } else {
    return { user: null };
  }
};

var security = {
  // Postmark Bounce API will post to here with basic authentication
  /*basic: function (req, res) {
    // decode base 64 data
    var credentials = req.headers.authorization.substring(req.headers.authorization.indexOf("Basic ") + "Basic ".length, req.headers.authorization.length);
    var buf = new Buffer(credentials, 'base64');
    var userdata = buf.toString();
    var username = userdata.substring(0, userdata.indexOf(":"));
    var password = userdata.substring(userdata.indexOf(":") + 1, userdata.length);

    var checkUser = function (err, user) {
      if (!err && user !== null) {
        mail.handleBounce(req, res, user);

      } else {
        logger.error(err ? err : "User is null when checking bounce");
        res.send(403);
      }
    };

    var strategy = new BasicStrategy();
    passport.use(strategy);
    strategy.verifyUser(username, password, checkUser);
  },
  initialize: function () {
    passport.use(new MongoStrategy());
  },*/
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
  /*accesstokenAuthenticationRequired: function (req, res, next) {
    var token = req.query.accesstoken;
    var tokenresourceid = req.query.tokenresourceid;
    tokenmanager.isTokenAllowedToAccessResource(token, tokenresourceid).then(function (accesstoken) {
      //fill req.user in order to get activitylogging etc. to work properly
      req.user = accesstoken.user;
      next();
    })
    .fail(function (err) {
      logger.error("Accesstoken auth failed for token " + token + " and resource id " + tokenresourceid);
      res.send(401, err);
    });
  },*/
  sendCurrentUser: function (req, res, next) {
    res.json(200, filterUser(req.user));
  },
  login: function (req, res, next) {
    var redirectParam,
      clientHost;
    clientHost = req.headers.origin;

    console.log("REQ BODY", req.body);
    console.log("REQ QUERy", req.query);

    // logger.log("Login", req.body.username);
    //logger.log("Login", req.query.username);

    // Monitoring the number of logins
    //nodetime.metric("Login", "Number of Logins", 1, 'times', 'sum');

    // form autofill works only on username, not on email as form field name
    //req.body.email = req.query.username;

    /*function authenticationFailed(err, user, info) {
      if (err) {
        logger.error("Error in authentication", err);
        return next(err);
      }
      if (!user) {
        return res.redirect(clientHost + "/#/login?error=invalidcredentials" + redirectParam);
      }
      req.logIn(user, function (err) {
        if (err) {
          logger.log("Error in login request", err);
          return res.redirect(clientHost +"/#/login?error=loginerror" + redirectParam);
        }
        usermanager.updateLastLoginDate(user.email).then(function () {
          // when we come from a projectinvitation via email, query has a redirect
          if (req.query && req.query.redirect && req.query.redirect !== undefined) {
            return res.redirect(clientHost + "/#/" + req.query.redirect);
          } else {
            return res.redirect(clientHost + "/#/projects/");
          }

        })
        .fail(function (err) {
          logger.log("Error in updating last login date", err);
          return res.redirect(clientHost + "/#/login?error=userupdateerror" + redirectParam);
        });
      });
    }

    return passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next); */
    res.send(200);
    // RETURN CURRENT USER res.json(200, filterUser(req.user));
  },

  logout: function (req, res, next) {
    req.logout();
    res.send(204);
  }
};

module.exports = security;