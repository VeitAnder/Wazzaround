var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var UserModel = require('../models/models.js').UserModel;
var ObjectId = require('mongojs').ObjectId;

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
  UserModel.get(ObjectId(id))
    .then(function (user) {
      if (user === null) {
        done(null, null);
      } else {
        done(null, user);
      }
    })
    .fail(function (err) {
      done(err, null);
    });
};

// Check whether the user passed in is a valid one
MongoDBStrategy.prototype.verifyUser = function (email, password, done) {
  if (!email || !password) {
    done(new Error("No User/Password provided!"), null);
  }

  UserModel.find({email: email.toLowerCase()})  // find this user
    .then(function (users) {
      if (users.length < 1) {
        done(new Error("User not found"), null);
        return;
      }
      if (users.length > 1) {
        done(new Error("Found more then one user"), null);
        return;
      }
      if (users[0].password === password && users[0].enabled) { // auth successful
        done(null, users[0]);
      } else {
        done(new Error("Invalid Password"), null);
        return;
      }
    })
    .fail(function (err) {
      done(err, null);
    });
};

module.exports = MongoDBStrategy;