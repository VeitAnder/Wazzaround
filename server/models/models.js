'use strict';

var models = function () {

  // using the the Modelizer library
  //var model = require('../../../../modelizer/lib/modelizer.js');
  var model = require('modelizer');

  var Attr = model.Attr;
  var Type = model.Attr.Types;
  var Ref = model.Ref;
  var RefArray = model.RefArray;
  var Operation = model.Operation;
  var Factory = model.Factory;

  var validators = {
    username: function (value) {
      if (value === undefined || value === null || value === "") { // TODO validate username
        throw new Error("you have to provide a username");
      }
      return value;
    },
    password: function (value) {
      // 1 Grossbuchstabe, 1 Zahl, 8 Stellen 
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a password");
      } else {

        var capitalLetter = /[A-ZÄÖÜ]/g;
        var capTest = capitalLetter.test(value);
        var number = /[0-9]/g;
        var numTest = number.test(value);

        if(!capTest || !numTest || value.length < 8) {
          console.log("PASSWORD NOT VALID");
          throw new Error("invalidPwd");
        }
      }
      return value;
    }
  };

  var UserModel = new model("users", {
    email: Attr(Type.string),  // email wird im username gespeichert
    username: Attr(Type.string, validators.username),
    password: Attr(Type.string, validators.password),

    profile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      company: Attr(Type.string),
      address: Attr(Type.string),
      location: {
        longitude: Attr(Type.number),
        latitude: Attr(Type.number)
      }
    },

    login: Operation(),
    logout: Operation(),
    register: Operation(),

    // TODO: add security
    userType: Attr(Type.string, Type.enum('user', 'admin'), Attr.default('user')),

    currentUser: Factory()
  });


  var BookableItemModel = new model("bookableItems", {
    description: Attr(Type.string),
    price: Attr(Type.number),

    events: [
      {
        start: Attr(Type.date),
        duration: Attr(Type.number),
        quantity: Attr(Type.number)
      }
    ],

    owner: Ref(UserModel),

    bookItem: Operation(),
    saveWithRepeatingEvents: Operation()
  });

  var ActivityModel = new model("activities", {
    name: Attr(Type.string),
    company: Attr(Type.string),
    address: Attr(Type.string),

    description: Attr(Type.string),

    images: [
      {
        public_id: Attr(Type.string),
        format: Attr(Type.string),
        name: Attr(Type.string),
        url: Attr(Type.string)
      }
    ],

    category: {
      main: Attr(Type.string),
      subs: [
        {
          title: Attr(Type.string)
        }
      ]
    },

    longitude: Attr(Type.number),
    latitude: Attr(Type.number),

    bookableItems: RefArray(BookableItemModel),

    // TODO security: der user könnte das hier schon auf true setzten
    published: Attr(Type.boolean, Attr.default(false)),

    owner: Ref(UserModel),

    getMyActivities: Factory(),
    getActivitiesFilterByTime: Factory({
      activitiesIds: Type.ObjectId,
      startDate: Type.date,
      endDate: Type.date
    })
  });

  var BookingModel = new model('bookings', {

    activity : Ref(ActivityModel),
    item : Ref(BookableItemModel),
    start: Attr(Type.date),
    quantity: Attr(Type.number),

    owner: Ref(UserModel),

    buy : Operation()
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

  var AccesstokenModel = new model("accesstokens", {
    "token": Attr(Type.string),
    "expires": Attr(Type.date),
    "user": Ref(UserModel),
    "sendReactivation": Operation(),
    "setNewPassword": Operation() // TODO password encrypted?

  });

  return {
    UserModel: UserModel,
    ActivityModel: ActivityModel,
    CategoryModel: CategoryModel,
    BookableItemModel: BookableItemModel,
    BookingModel: BookingModel,
    AccesstokenModel: AccesstokenModel
  };
}();

if (typeof window !== 'undefined') {
  // we run in a browser environment

  // http://stackoverflow.com/questions/17544965/unhandled-rejection-reasons-should-be-empty
  Q.stopUnhandledRejectionTracking();  // why does this happen?

  // The current user.  You can watch this for changes due to logging in and out
  angular.module('modelizer', [])
    .factory('models', function () {

      return models;
    });
}

if (typeof window === 'undefined') {
  // we don't run in a browser environment

  module.exports = models;
}