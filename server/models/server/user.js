/**
 * Created by jonathan on 20.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;
var moment = require('moment');
var _ = require('lodash');

var models = require('../models.js');
var UserModel = require('../models.js').UserModel;
var CryptoJS = require("crypto-js");

var token = require('token.js');
var mail = require('../../lib/mail.js');

var security = require('../../lib/security');

///////////////////////
// read/write filters

// setup filters for the UserModel
UserModel.readFilter(function (req) {
  if (!req.isAuthenticated()) {
    return false;  // if not logged in don't allow read operations
  }

  if (req.user.userType === 'admin') return true;  // allow admin to access all users

  return {_id: ObjectId(req.user._id)};  // filter for only your documents (your user id)
});

function checkRequiredFieldsForUserType(userDoc) {
  if (userDoc.userType === 'provider') {
    if (!userDoc.company || !userDoc.firstName || !userDoc.lastName || !userDoc.tel || !userDoc.contactperson.name || !userDoc.address || !userDoc.zip || !userDoc.city || !userDoc.country) {

      return false;

    } else {
      return true;
    }
  }
}

UserModel.writeFilter(function (userDoc, req) {
  if (!req.isAuthenticated()) {
    return false;  // if not logged in don't allow write operations
  }

  // TODO: hier mit orginal vergleichn!
//  if(checkRequiredFieldsForUserType(userDoc) === false) {
//    return false;
//  }

  // TODO: Asyncron und funktionier (noch) nicht
  // fields that may not be overwritten, get from db and write to userdoc
//  models.UserModel.find({email: userDoc.email})
//    .then(function(user) {
//      console.log("CHECK NEW FIELDS");
//      userDoc.registrationdate = user.registrationdate;
//      userDoc.lastlogindate = user.lastlogindate;
//      userDoc.userType = user.userType;
//    });

  // allow the user to save his own User Object
  if (userDoc._id.toString() === req.user._id.toString()) {
    return true;
  }

  return false;  // else: filter failed -> access denied
});

///////////////////////
// Operation Impl.

// setup Operations for the model to register an user
UserModel.operationImpl("register", function (params, req) {
  var user = models.UserModel.create();
  user.email = params.email.toLowerCase();
  user.password = params.password;
  var enteredpromocode = params.enteredpromocode;

  var tokenObj = models.AccesstokenModel.create();
  tokenObj.token = token(32);
  tokenObj.expires = moment().add('days', 1).toDate();

  if (params.profile) {
    for (var i in params.profile) {
      user.profile[i] = params.profile[i];
    }
    //user.profile = params.profile;
  }
  // set userType if provided
  // todo: check validity of userType by checking other required fields e.g. of userType provider
  if (params.userType) {
    user.userType = params.userType;
  }

  // save the new user
  return Q()
    .then(function () {
      if (params.email === undefined || params.email === "") {
        throw new Error("You have to provide a E-Mail address");
      }

      return models.UserModel.find({email: params.email});  // find all existing users
    })
    .then(function (users) {
      if (users.length > 0) {
        if (users[0].email === user.email && !users[0].emailconfirmed && users[0].enabled) {
          // resend activation token email to this user if the users email has not been confirmed yet
          // re-save existing user
          return users[0];
        } else {
          throw new Error("User already exists and can't be registered again. Please contact our support.");
        }
      }

      // create new user and save this user
      return user.save();
    })
    .then(function (user) {
      // set promo code when registering
      // generate promocode out of user._id
      user.promotion.promocode = CryptoJS.SHA256(user._id.toString()).toString(CryptoJS.enc.Hex).substr(0, 8);
      return user.save();
    })
    .then(function (user) {
      // set promocode

      var handleEnteredPromoCode = function () {
        if (enteredpromocode !== undefined) {
          return addUserToAcquiredProvidersOfPromocodeOwner(user, enteredpromocode);
        } else {
          return true;
        }
      };

      // set token
      tokenObj.user.setObject(user);

      return Q.all([
        tokenObj.save(),
        handleEnteredPromoCode()
      ]);

    })
    .spread(function (tokenObj, promocodeowner) {
      return mail.sendActivationTokenEmail(tokenObj);
    })
    .then(function () {  // if save was ok
      return {status: "ok"};
    });
});

var addUserToAcquiredProvidersOfPromocodeOwner = function (user, promocode) {
  // find user by promocode
  return UserModel.find({
    "promotion.promocode": promocode
  })
    .then(function (promocodeowners) {
      if (promocodeowners.length > 1) {
        return new Error("More than one owner of the promocode " + promocode);
      } else if (promocodeowners.length === 1) {

        promocodeowners[0].promotion.acquiredproviders.push({
          _reference: user._id
        });

        // sicherstellen, dass der Promocode nur einmal angegeben werden kann
        promocodeowners[0].promotion.acquiredproviders = _.uniq(promocodeowners[0].promotion.acquiredproviders, function (reference) {
          return reference._reference.toString();
        });

        return promocodeowners[0].save();
      } else {
        return new Error("No user found who owns the promocode " + promocode);
      }
    });
};

// a operation to login a user
UserModel.operationImpl("login", function (params, req) {
  return security.login(req);
});

// logout
UserModel.operationImpl("logout", function (params, req) {
  return security.logout(req);
});

UserModel.factoryImpl("currentUser", function (params, req) {
  var deferred = Q.defer();
  if (!req.isAuthenticated()) {
    var err = new Error("Not authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  }

  return models.UserModel.get(req.user._id)
    .then(function (user) {
      return user;
    })
    .fail(function (err) {
      return err;
    });
});

UserModel.operationImpl("getProfile", function (params, req) {
  return UserModel.get(ObjectId(params.id))
    .then(function (user) {
      return {
        company: user.profile.company
      };
    });
});

UserModel.factoryImpl("getProviders", function (params, req) {
  var deferred = Q.defer();
  if (!req.isAuthenticated()) {
    var err = new Error("Not authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  } else if (req.user.userType !== 'admin') {
    var err = new Error("Not allowed");
    err.statusCode = 405;
    deferred.reject(err);
    return deferred.promise;
  }

  return UserModel.find({
    "$or": [
      {
        userType: "provider"
      },
      {
        userType: "admin"
      }
    ]
  });
});

UserModel.operationImpl("getMyPromotedUsers", function (params, req) {
  var deferred = Q.defer();
  if (!req.isAuthenticated()) {
    var err = new Error("Not authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  } else if (req.user.userType !== 'admin' && req.user.userType !== 'provider') {
    var err = new Error("Not allowed");
    err.statusCode = 405;
    deferred.reject(err);
    return deferred.promise;
  }

  return UserModel.find({
    _id: req.user._id
  })
    .then(function (users) {
      var acquiredprovidersQ = [];
      users[0].promotion.acquiredproviders.forEach(function (acquiredprovider) {
        acquiredprovidersQ.push(acquiredprovider.load());
      });

      return Q.all(acquiredprovidersQ);
    })
    .then(function (acquiredproviders) {

      // only return not sensitive data
      return _.map(acquiredproviders, function (acquiredprovider) {
        return {
          email: acquiredprovider.email,
          profile: {
            firstName: acquiredprovider.profile.firstName,
            lastName: acquiredprovider.profile.lastName,
            tel: acquiredprovider.profile.tel,
            mobile: acquiredprovider.profile.mobile
          }
        };
      });
    });
});
