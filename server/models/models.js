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
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a username");
      }
      return value;
    },
    password: function (value) {
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a password");
      }
      return value;
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
        longitude: Attr(Type.number),
        latitude: Attr(Type.number)
      }
    },

    login: Operation(),
    logout: Operation(),
    register: Operation(),
    setNewPassword: Operation(), // TODO password encrypted? userid? what else?

    currentUser: Factory()
  });


  var BookableItemModel = new model("bookableItems", {
    description: Attr(Type.string),
    price: Attr(Type.number),

//    bookableEvents: [{
//      start: Attr(Type.date),
//      end: Attr(Type.date),
//      quantity: Attr(Type.number),
//      repeating : Attr(Type.boolean),
//      daysOfWeek: {
//        Mon : Attr(Type.boolean),
//        Tue : Attr(Type.boolean),
//        Wed : Attr(Type.boolean),
//        Thu : Attr(Type.boolean),
//        Fri : Attr(Type.boolean),
//        Sat : Attr(Type.boolean),
//        Son : Attr(Type.boolean)
//      }
//    }],

    events : [{
      start: Attr(Type.date),
      duration: Attr(Type.number),
      quantity: Attr(Type.number)
    }],

    owner: Ref(UserModel),

    bookItem : Operation(),
    saveWithRepeatingEvents : Operation()
  });


  var ActivityModel = new model("activities", {
    name: Attr(Type.string),
    company: Attr(Type.string),
    address: Attr(Type.string),

    description: Attr(Type.string),
    images: Attr(Type.array),

    category: {
      main: Attr(Type.string),
      subs: [{
        title: Attr(Type.string)
      }]
    },

    longitude: Attr(Type.number),
    latitude: Attr(Type.number),

    bookableItems: RefArray(BookableItemModel),

    published: Attr(Type.boolean),

    owner: Ref(UserModel),

    getMyActivities: Factory(),
    getActivitiesFilterByTime : Factory( {
      activitiesIds : Type.ObjectId,
      startDate : Type.date,
      endDate : Type.date
    })
  });

  var BookingsModel = new model('bookings', {
//    derUserDerBucht: 34,
//    verweisAufAnbieter :432,

    activityCopy : ActivityModel,
    bookableItemCopy : BookableItemModel,
    bookableItemRef : Ref(BookableItemModel),

    booking : {
      start: Attr(Type.date),
      end: Attr(Type.date),
      quantity: Attr(Type.number),
      price: Attr(Type.number)
    },

    cancelBooking : Operation()
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

//  var token = require('token.js');              // TODO Authorization token for resetting password
//  var AccesstokenModel = new model("accesstokens", {
//    "token": Attr(Type.string), function () {
//      return token(32);
//    },
//    "resourceid": Attr(Type.string),
//    "expires": Attr(Type.Date),
//    "user": Ref(UserModel)
//  });

  return {
    UserModel: UserModel,
    ActivityModel: ActivityModel,
    CategoryModel: CategoryModel,
    BookableItemModel: BookableItemModel,
    BookingsModel: BookingsModel
//    AccesstokenModel: AccesstokenModel
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