var config = require('../config.js');

var mongoose = require('mongoose-q')();
var crypto = require('crypto');
var token = require('token.js');
var Q = require('q');

//USER SCHEMA
var userSchema = new mongoose.Schema({//  date: {type: Date, default: Date.now},
  "email": {type: String, required: true, unique: true, lowercase: true, trim: true}, // lowercase necessary to avoid duplicate emails with just different lower/capital letters
  "profile": {
    "firstName": {type: String},
    "lastName": {type: String},
    "company": {type: String},
    "address": {type: String}
  },
  "password": {type: String},
  "date": {type: Date, "default": Date.now },
  "alreadyloggedin": {type: Boolean, "default": false},
  "lastlogindate": {type: Date},
  "accountconfirmed": {type: Boolean, "default": false},
  "accountconfirmationtoken": {type: String, required: true, "default": function () {
    return token(32);
  }},
  "enabled": {type: Boolean, "default": true},
  //"paying": {type: Boolean, "default": false},   //is user a paying user - enables project creation
  "payment": {
    // Userstate wird aus dem firstprojet und contractStartDate abgeleitet
    //"userstate" : { type: String, enum: ["participant", "testing", "disabled", "paying"], default : "testing" },
    "firstproject": {type: Date },  // date when the first projecte was created
    "trialperioddays": { type: Number, "default": 60 },
    "contractStartDate": { type: Date },  // seit wann ist der Vertrag aktivert
    "billingaddress": {
      "name": { type: String },
      "street": { type: String },
      "zip": { type: String },
      "city": { type: String },
      "country": { type: String },
      "uid": { type: String }
    },
    "customerbillingplan": {
      "interval": { type: String, enum: ["monthly", "annually"]},
      "date": {type: Date, "default": Date.now },
      "type": { type: String, default: "onaccount"}, // auf Rechnung
      "plan": { type: String, enum: ["none", "v1_small_19", "v1_medium_59", "v1_large_199", "custom"], default: "none"}
    },
    "activebillingplan": {
      "interval": { type: String, enum: ["monthly", "annually"]},
      "date": {type: Date, "default": Date.now },
      "type": { type: String, default: "onaccount"}, // auf Rechnung
      "plan": { type: String, enum: ["none", "v1_small_19", "v1_medium_59", "v1_large_199", "custom"], default: "none"}
    }
  }
});

//password encrypt method
userSchema.statics.encrypt = function encrypt(str) {
  var algorithm = config.security.passwordencryptionalgorithm;
  var key = config.security.passwordencryptionkey;
  var pw = str;
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(pw, 'utf8', 'hex') + cipher.final('hex');
  return encrypted;
};

//password generate method
userSchema.statics.generatePassword = function () {
  var length = 8,
    charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

// only set firstproject date once - eg. the first time a project is created by the user
userSchema.statics.updateFirstProjectDate = function (userid) {
  var Users = this;
  return Users.findByIdQ(userid)
    .then(function (user) {
      if (user !== null) {
        return Q.resolve(user);
      } else {
        return Q.reject("No User found in updateFirstProjectDate");
      }
    })
    .then(function (user) {
      if (user.payment !== undefined && user.payment.firstproject === undefined) {
        return Users.findByIdAndUpdateQ(
          userid,
          {
            "payment.firstproject": new Date()
          });
      } else {
        return Q.resolve();
      }
    });
};

// promises to return the total space consumed by an user
userSchema.statics.consumedSpace = function (userId) {
  var Plans = require('../models/model_plans.js');

  /*
   Projects.findQ(
   {participants : { $elemMatch: { user : mongoose.Types.ObjectId("523c38dd208698c715000003"), "permission" : "owner" } } },
   {_id : 1, title : 1})
   .then(function (projectsOfUser) {
   console.log(projectsOfUser);


   })
   */

  return Plans.aggregateQ(
    {
      $match: {
        //createdby : mongoose.Types.ObjectId("523c38dd208698c715000003")
        createdby: userId
      }
    },
    {
      $unwind: "$revisions"
    },
    {
      $group: {
        _id: false,
        project_pdf_size: {
          $sum: "$revisions.pdf_metadata.size"
        },
        project_dwg_size: {
          $sum: "$revisions.dwg_metadata.size"
        }
      }
    })
    .then(function (res) {
      return res[0].project_pdf_size + res[0].project_dwg_size;
    });
};

module.exports = mongoose.model('users', userSchema);