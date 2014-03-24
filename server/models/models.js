'use strict';

var models = function () {

  var model = require('modelizer');

  var Attr = model.Attr;
  var Type = model.Attr.Types;
  var Ref = model.Ref;
  var RefArray = model.RefArray;
  var Operation = model.Operation;
  var Factory = model.Factory;

  var validators = {
    email: function (value) {
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a username (it is empty)");
      }
      return value;
    }
  };

  var UserModel = new model("users", {
    email: Attr(Type.string, validators.email),  // email ist auch username
    password: Attr(Type.string),

    profile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      company: Attr(Type.string),
      address: Attr(Type.string),
      city: Attr(Type.string),
      zip: Attr(Type.string),
      tel: Attr(Type.string),
      fax: Attr(Type.string),
      uid: Attr(Type.string, Attr.default('')),
      country: Attr(Type.string),
      contactperson: {
        name: Attr(Type.string)
      },
      bankaccount: {
        bank: Attr(Type.string),
        iban: Attr(Type.string),
        bic: Attr(Type.string),
        nameofaccountowner: Attr(Type.string)
      }
    },

    login: Operation(),
    logout: Operation(),
    register: Operation(),

    // TODO: add security
    userType: Attr(Type.string, Type.enum('user', 'admin', 'provider'), Attr.default('user')),

    currentUser: Factory()
  });

  var EventModel = new model("events", {
    start: Attr(Type.date),
    duration: Attr(Type.number),
    quantity: Attr(Type.number),

    owner: Ref(UserModel)   //TODO
  });

  var BookableItemModel = new model("bookableItems", {
    description: {
      en: Attr(Type.string),
      de: Attr(Type.string),
      it: Attr(Type.string)
    },
    price: Attr(Type.number),

    events: RefArray(EventModel),
//    events : [{
//      start: Attr(Type.date),
//      duration: Attr(Type.number),
//      quantity: Attr(Type.number)
//    }],

    owner: Ref(UserModel)
  });

  var ActivityModel = new model("activities", {
    inputlanguage: Attr(Type.string, Type.enum('en', 'de', 'it', 'manual')),
    name: {
      en: Attr(Type.string),
      de: Attr(Type.string),
      it: Attr(Type.string)
    },
    company: Attr(Type.string),
    address: Attr(Type.string),

    description: {
      en: Attr(Type.string),
      de: Attr(Type.string),
      it: Attr(Type.string)
    },

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
          key: Attr(Type.string)
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

    activity: Ref(ActivityModel),
    item: Ref(BookableItemModel),
    start: Attr(Type.date),
    quantity: Attr(Type.number),

    //booker: {},  // TODO: who booked

    owner: Ref(UserModel),

    buy: Operation()
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
    "setNewPassword": Operation()
  });

  return {
    UserModel: UserModel,
    ActivityModel: ActivityModel,
    CategoryModel: CategoryModel,
    BookableItemModel: BookableItemModel,
    BookingModel: BookingModel,
    AccesstokenModel: AccesstokenModel,
    EventModel: EventModel
  };
}();

if (typeof window !== 'undefined') {
  // we run in a browser environment

  var Q = require('q');
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