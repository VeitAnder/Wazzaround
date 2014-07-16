/**
 * Created by jonathan on 20.03.14.
 */

var Q = require('q');
var ObjectId = require('mongojs').ObjectId;
var moment = require('moment');

var models = require('../models.js');
var UserModel = require('../models.js').UserModel;

var token = require('token.js');
var mail = require('../../lib/mail.js');

var security = require('../../lib/security');

///////////////////////
// read/write filters

// setup filters for the UserModel
UserModel.readFilter(function (req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow read operations
  }

  return {_id: ObjectId(req.session.user._id) };  // filter for only your documents (your user id)
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
  if (!req.session.auth) {
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
  if (userDoc._id.toString() === req.session.user._id) {
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
        throw new Error("User already exists");
      }
      return user.save();  // save the new user
    })
    .then(function (user) {
      tokenObj.user.setObject(user);
      tokenObj.save();
      return tokenObj;
    })
    .then(function (tokenObj) {
      return;
//      return mail.sendActivationTokenEmail(tokenObj.user.ref(), tokenObj.token);
    })
    .then(function () {  // if save was ok
      return {status: "ok"};
    });
});

// a operation to login a user
UserModel.operationImpl("login", function (params, req) {
  return security.login(req);
});

// logout
UserModel.operationImpl("logout", function (params, req) {
  return security.logout(req);
});

UserModel.factoryImpl("currentUser", function (params, req) {
  console.log("currentUser");

  var deferred = Q.defer();
  if (!req.session.auth) {
    var err = new Error("not authorized");
    err.statusCode = 401;
    deferred.reject(err);
    return deferred.promise;
  }

  //return models.UserModel.get(ObjectId(req.session.user_id));
//  return UserModel.find({ _id: ObjectId(req.session.user._id)})
//    .then(function (users) {
//      console.log("users", users);
//      if (users.length !== 1) throw new Error("User not found");
//      return users[0];
//    });
//


  //return models.UserModel.get(ObjectId(req.session.user_id));
//  return UserModel.find({ _id: ObjectId(req.session.user._id)})
//    .then(function (users) {
//      console.log("users", users);
//      if (users.length !== 1) {
//        throw new Error("User not found");
//      }
//      return users[0];
//    });
//

  return req.user;
});

UserModel.operationImpl("getProfile", function (params, req) {
  return UserModel.get(ObjectId(params.id))
    .then(function (user) {
      return {
        company: user.profile.company
      };
    });
});
