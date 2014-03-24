var config = require('../config.js');

var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var Users = require('../models/model_users.js');

//encrypt method - same as in model_users.js !!
var encrypt = function (str) {
  var algorithm = config.security.passwordencryptionalgorithm;
  var key = config.security.passwordencryptionkey;
  var pw = str;
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(pw, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
};

function MongoDBStrategy() {
  // Call the super constructor - passing in our user verification function
  // We use the email field for the username
  LocalStrategy.call(this, { usernameField: 'email' }, this.verifyUser.bind(this));
  // Serialize the user into a string (id) for storing in the session
  passport.serializeUser(function (user, done) {
    done(null, user._id); // Remember that MongoDB has this weird { _id: { $oid: 1234567 } } structure
  });
  // Deserialize the user from a string (id) into a user (via a cll to the DB)
  passport.deserializeUser(this.get.bind(this));
  // We want this strategy to have a nice name for use by passport, e.g. app.post('/login', passport.authenticate('mongo'));
  this.name = MongoDBStrategy.name;
}

// MongoDBStrategy inherits from LocalStrategy
util.inherits(MongoDBStrategy, LocalStrategy);

MongoDBStrategy.name = "mongo";

// Get a user by id
MongoDBStrategy.prototype.get = function (id, done) {
  Users.findOneQ({
    _id: id
  }).then(function (user) {
      if (user === null) {
        done(null, null);
      } else {
        done(null, user);
      }
    }, function (err) {
      done(err, null);
    })
    .done();
};

// Find a user by their email
MongoDBStrategy.prototype.findByEmail = function (email, done) {
  Users.findOneQ({
    email: email.toLowerCase()
  })
    .then(function (user) {
      if (user === null) {
        done(null, null);
      } else {
        done(null, user);
      }
    }, function (err) {
      done(err, null);
    })
    .done();
};

// Check whether the user passed in is a valid one
MongoDBStrategy.prototype.verifyUser = function (email, password, done) {
  this.findByEmail(email, function (err, user) {
    if (!err && user) {
      //check also for accountconfirmed flag - added by reacture
      if (user.password !== encrypt(password) || !user.accountconfirmed || !user.enabled) {
        user = null;
      }
    }
    done(err, user);
  });
};

module.exports = MongoDBStrategy;