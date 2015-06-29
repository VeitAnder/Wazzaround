var moment = require('moment');
var models = require('../models.js');
var AccesstokenModel = require('../models.js').AccesstokenModel;
var token = require('token.js');
var mail = require('../../lib/mail.js');

///////////////////////
// read/write filters

AccesstokenModel.readFilter(function (req) {
  return false;   // only server is allowed to read that
});

AccesstokenModel.writeFilter(function (obj, req) {
  return false;  // only server is allowed to make changes
});

///////////////////////
// Operation Impl.

AccesstokenModel.operationImpl("sendReactivation", function (params, req) {
  var tokenObj = models.AccesstokenModel.create();
  tokenObj.token = token(32);
  tokenObj.expires = moment().add(1, 'days').toDate();

  return models.UserModel.find({ email: params.email })
    .then(function (users) {
      console.log("GOT USERS", users);
      if (users.length !== 1) {
        throw new Error("User not found");
      }
      return users[0];
    })

    .then(function (user) {
      tokenObj.user.setObject(user);
      tokenObj.save();
      return tokenObj;
    })

    .then(function (tokenObj) {
      return mail.sendResetPasswordMail(tokenObj.user.ref(), tokenObj.token, params.languageKey);
    })

    .then(function () {
      return { "status": "OK" };
    });

});

AccesstokenModel.operationImpl("setNewPassword", function (params, req) {
  // got token and user email and pwd in params
  return models.AccesstokenModel.find({ token: params.token })
    .then(function (tokenObjs) {
      if (tokenObjs.length !== 1) {
        throw new Error("No tokens found for token id", params.token);
      }
      return tokenObjs[0];
    })

    .then(function (tokenObj) {
      // check expiration date, if it's today or before, its already expired
      if (moment(tokenObj.expires).isBefore(new Date(), 'day')) {
        throw new Error("This token has expired and cannot be used for setting a new password", tokenObj);
      }
      return tokenObj.user.load();
    })

    .then(function (user) {
      // token validieren ob es für diesen user ist
      if (user.email === params.email) {
        // reset password
        user.password = params.password;
        // der user hat seine E-Mail implizit validiert weil er den Passwort-Reset Link in seinem E-Mailaccount klicken konnte
        user.emailconfirmed = true;
        return user.save();
      } else {
        throw new Error("Authorization went wrong, accesstoken and user dont match");
      }
    })

    .then(function () {
      console.log("AFTER SAVING USER");
      // remove accesstoken after setting new password
//      return models.AccesstokenModel.remove({ token: params.token });    TODO  Jonathan fragen warum das nicht geht
//    })

//    .then(function () {
//      console.log("AFTER ALL DONE");
      return { "status": "OK" };
    });
});


