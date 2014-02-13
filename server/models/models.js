'use strict';

var models = function () {
  // using the the Modelizer library
  var model = require('modelizer');
  //var model = require('../../../../modelizer/lib/modelizer.js');

  var Attr = model.Attr;
  var Type = model.Attr.Types;
  var Ref = model.Ref;
  var Operation = model.Operation;
  var Factory = model.Factory;

  var validators = {
    username: function (obj, name) {
      var value = obj[name];
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a username");
      }
    },
    password: function (obj, name) {
      var value = obj[name];
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a password");
      }
    }
  };

  var UserModel = new model("users", {
    email: Attr(Type.string),
    username: Attr(Type.string, validators.username),
    password: Attr(Type.string, validators.password),

    profile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      company: Attr(Type.string),
      address: Attr(Type.string),
      location: {
        longitude: Attr(Type.string),
        latitude: Attr(Type.string)
      }
    },

    login: Operation(),
    logout: Operation(),
    register: Operation(),

    currentUser: Factory()
  });

  var ActivityModel = new model("activities", {
    name: Attr(Type.string),
    company: Attr(Type.string),

    description: Attr(Type.string),
    images: Attr(Type.array),

    category: {
      main: Attr(Type.string),
      sub: Attr(Type.string)
    },

    longitude: Attr(Type.number),
    latitude: Attr(Type.number),

    availability: [{
      start: Attr(Type.string),
      end: Attr(Type.string),
      quantity: Attr(Type.number)
    }],

    owner: Ref(UserModel),

    getMyActivities: Factory()
  });

  var CategoryModel = new model("categories", {
    title: Attr(Type.string),
    key: Attr(Type.string, Type.enum("sports", "culture", "wellness")),
    sub: [
      {
        title: Attr(Type.string),
        key: Attr(Type.string)
      }
    ]
  });

  return {
    UserModel: UserModel,
    ActivityModel: ActivityModel,
    CategoryModel: CategoryModel
  };
};

if (typeof window !== 'undefined') {
  // we run in a browser environment

  // http://stackoverflow.com/questions/17544965/unhandled-rejection-reasons-should-be-empty
  Q.stopUnhandledRejectionTracking();  // why does this happen?

  // The current user.  You can watch this for changes due to logging in and out
  angular.module('modelizer', [])
    .factory('models', function () {
      var theModels = models();
      return theModels;
    });
}

if (typeof window === 'undefined') {
  // we don't run in a browser environment

  module.exports = models();
}