var config = require('../config.js');

var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var UserModel = require('../models/models.js').UserModel;

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
  return UserModel.find({_id: id})
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

  console.log("verifyUser", email, password);

//  if (!email || !password) {
//    throw new Error("No User/Password provided!");
//  }

//  return UserModel.find({email: params.email.toLowerCase()})  // find this user
//    .then(function (users) {
//      if (users.length < 1) {
//        throw new Error("User not found");
//      }
//      if (users.length > 1) {
//        throw new Error("Found more then one user");
//      }
//
//      console.log("logging in");
//
//      if (users[0].password === params.password) { // auth successful
//        // remember in a session, that auth was successful
//        req.session.auth = true;
//        // remember the user in the session
//        req.session.user = users[0];
//        return users[0];
//      } else {
//        throw new Error('Invalid Password');
//      }
//    })
//    .then(function (user) {  // store last login date
//      user.lastlogindate = new Date();
//      return user.save();
//    })
//    .then(function () {  // if login was ok
//      return {status: "ok"};
//    });

  return UserModel.find({email: email})
    .then(function (user) {
      if (user === null) {
        done(null, null);
      } else {
//      //check also for accountconfirmed flag - added by reacture
//      if (user.password !== encrypt(password) || !user.accountconfirmed || !user.enabled) {
//        user = null;
//      }
        done(null, user);
      }
    }, function (err) {
      done(err, null);
    });

};

module.exports = MongoDBStrategy;