var config = require('../config.js');

var util = require('util');
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

function BasicStrategy() {
  // We want this strategy to have a nice name for use by passport, e.g. app.post('/login', passport.authenticate('mongo'));
  this.name = BasicStrategy.name;
}

// BasicStrategy inherits from LocalStrategy
util.inherits(BasicStrategy, LocalStrategy);

BasicStrategy.name = "basic";

// Find a user by their email
BasicStrategy.prototype.findByEmail = function (email, done) {
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
BasicStrategy.prototype.verifyUser = function (email, password, done) {
  this.findByEmail(email, function (err, user) {
    if (!err && user) {
      //check also for accountconfirmed flag - added by planfred
      if (user.password !== encrypt(password) || !user.accountconfirmed || !user.enabled) {
        user = null;
      }
    }
    done(err, user);
  });
};

module.exports = BasicStrategy;