var _ = require('lodash');
var Q = require('q');
var restify = require('restify');

var Users = require('../models/model_users.js');
var logger = require('../lib/logger.js');

var usermanager = {
  createInternalAccount: function (email) {
    var silentuser = new Users({
      email: email.toLowerCase()
      // Todo: userstate silentuser
    });
    return silentuser.saveQ();
  },
  createLoginAccount: function (userdata) {
    var deferred = Q.defer();

    // @TODO refactor deletes into some more generic safety rules
    // remove fields from the wild for safety to let mongoose set default vaules
    delete userdata.date;
    delete userdata.alreadyloggedin;
    delete userdata.lastlogindate;
    delete userdata.accountconfirmed;
    delete userdata.accountconfirmationtoken;
    delete userdata.enabled;
    delete userdata.paying;

    //encrypt password field
    if (userdata.password) {
      userdata.password = Users.encrypt(userdata.password);
    }

    Q.fcall(function () {
      return usermanager.getAccount(userdata.email);
    })
      .then(function (user) {
        var loginuser;

        //check for account upgrade or new account creation
        if (user === null) {
          // no user available, createLoginAccount
          loginuser = new Users(userdata);
        } else {
          // internal user available, upgrade to login account
          loginuser = _.extend(user, userdata);
        }

        loginuser.saveQ().then(function (saveduser) {
          deferred.resolve(saveduser);
        }, function () {
          deferred.reject(new restify.errors.BadDigestError("Could not save user " + userdata.email));
        });

      })
      .done();

    return deferred.promise;
  },
  getAccount: function (email) {
    return Users.findOneQ({
      email: email.toLowerCase()
    });
  },
  confirmAccount: function (token) {
    return Users.findOneQ(
      {
        accountconfirmationtoken: token
      })
      .then(function (user) {
        if (user === null) {
          return Q.reject(new restify.errors.InvalidArgumentError("token " + token + " unknown. "));
        } else if (user.accountconfirmed === true) {
          // email already confirmed
          return Q.resolve({"email": user.email, "alreadyconfirmed": true });
        } else {
          user.accountconfirmed = true;
          return user.saveQ();
        }
      }, function () {
        return Q.reject(new restify.errors.BadDigestError("User could not be read from Database."));
      });
  },
  isEmailAdressAvailableForLoginAccount: function (email) {
    // @TODO - wrong promise API design - Api should return boolean value and not rely on resolve/reject !!!
    var deferred = Q.defer();
    Users.findOneQ({
      email: email.toLowerCase()
    })
      .then(function (user) {
        if (user === null) {
          deferred.resolve(null);
        } else {
          if (user.enabled === false) {
            // if user is enabled and not accountconfirmed yet, user can register again
            deferred.reject(new restify.errors.NotAuthorizedError("Email address " + email + " is disabled."));
          } else {
            if (user.accountconfirmed === false) {
              deferred.resolve(user);
            } else {
              // if user is disabled, user can't register under this email address although not accountconfirmed yet
              deferred.reject(new restify.errors.NotAuthorizedError("Email address " + email + " is already in use."));
            }
          }
        }
      })
      .fail(function (err) {
        deferred.reject(new restify.errors.ResourceNotFoundError("Could not find user with email " + email + " Err: " + err));
      });
    return deferred.promise;
  },

  setPassword: function (email, newpassword) {
    //use find and save to get automatic password encryption on save (update does not run mongoose schema setter functions)
    return Users.findOneAndUpdateQ({
        email: email.toLowerCase()
      },
      {
        $set: {
          password: Users.encrypt(newpassword)
        }
      });
  },
  generatePassword: function () {
    return Users.generatePassword();
  },
  updateProfile: function (email, profile) {
    //use find and save to get automatic password encryption on save (update does not run mongoose schema setter functions)
    return Users.findOneQ({
      email: email.toLowerCase()
    })
      .then(function (user) {
        user.profile = profile;
        return user.saveQ();
      })
      .fail(function(err) {
        return Q.reject(err);
      });
  },
  updateLastLoginDate: function (email) {
    //use find and save to get automatic password encryption on save (update does not run mongoose schema setter functions)
    return Users.findOneQ({
      email: email.toLowerCase()
    })
      .then(function (user) {
        user.alreadyloggedin = true;
        user.lastlogindate = new Date();
        return user.saveQ();
      })
      .fail(function(err) {
        return Q.reject(err);
      });
  },
  createFirstProjectDate: function (userId) {
    return Users.findOneQ({
      _id: userId
    })
      .then(function (user) {
        if (user.firstproject === undefined) {
          logger.verbose("User (" + user.email + ") created his first project");
          user.payment.firstproject = new Date();
          return user.saveQ();
        }
      })
      .fail(function(err) {
        return Q.reject(err);
      });
  }


};

//expose public api
module.exports = usermanager;