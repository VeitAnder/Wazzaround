'use strict';

var models = function () {

//  if (typeof window === 'undefined') {
//    var model = require('../../../modelizer/lib/modelizer');
//  } else {
//    var model = require('modelizer');
//  }
  var model = require('modelizer');

  var Attr = model.Attr;
  var Type = model.Attr.Types;
  var Ref = model.Ref;
  var ObjArray = model.ObjArray;
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
    registrationdate: Attr(Type.date, Attr.default(new Date())),
    lastlogindate: Attr(Type.date),

    profile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      company: Attr(Type.string),
      address: Attr(Type.string),
      city: Attr(Type.string),
      zip: Attr(Type.string),
      tel: Attr(Type.string),
      fax: Attr(Type.string),
      uid: Attr(Type.string),
      country: Attr(Type.string),
      contactperson: {
        name: Attr(Type.string)
      }
//      bankaccount: {
//        bank: Attr(Type.string),
//        iban: Attr(Type.string),
//        bic: Attr(Type.string),
//        nameofaccountowner: Attr(Type.string)
//      }
    },

    login: Operation(),
    logout: Operation(),
    register: Operation(),

    // TODO: add security
    userType: Attr(Type.string, Type.enum('user', 'admin', 'provider'), Attr.default('user')),

    currentUser: Factory()
  });

  // @TODO - EventModel braucht _id
  var EventModel = new model("events", {
    start: Attr(Type.date),
    end: Attr(Type.date),
    quantity: Attr(Type.number),
    price: Attr(Type.number)
  });

  // @TODO - BookableItemModel braucht _id
  var BookableItemModel = new model("bookableItems", {
    description: {
      en: Attr(Type.string),
      de: Attr(Type.string),
      it: Attr(Type.string)
    },
    events: ObjArray(EventModel)
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

    // muss umbennat werden !!!
    // http://docs.mongodb.org/manual/core/geospatial-indexes/#multi-location-documents-for-2d-indexes
    // http://myadventuresincoding.wordpress.com/2011/10/02/mongodb-geospatial-queries/

    // don' forget to create an index via:
    //  db.activities.ensureIndex( {"location" : "2d"} );
    location : {
      lng: Attr(Type.number),
      lat: Attr(Type.number)
    },

    bookableItems: ObjArray(BookableItemModel),

    // TODO security: der user könnte das hier schon auf true setzten
    published: Attr(Type.boolean, Attr.default(false)),

    owner: Ref(UserModel),

    getMyActivities: Factory(),  // Do not use

    getActivitiesFilterByTime: Factory({  // Do not use
      activitiesIds: Type.ObjectId,
      startDate: Type.date,
      endDate: Type.date
    }),

    filteredActivities: Factory({
      from: {  // links oben
        lng: Attr(Type.number),
        lat: Attr(Type.number)
      },
      to: {  // rechts unten
        lng: Attr(Type.number),
        lat: Attr(Type.number)
      },
      startDate: Attr(Type.date), // optional
      endDate: Attr(Type.date) //optional
    })
  });

  var BookingModel = new model('bookings', {
    activity: Ref(ActivityModel),
    item: Ref(EventModel),
    quantity: Attr(Type.number),

    //booker: {},  // TODO: who booked
    owner: Ref(UserModel),
    buy: Operation()
  });

/*

  bookings : {
    _id : 23423
    name : Hans Joseph,
      state: Attr(Enum(“booked”, “pending”)),
    creationdate: Attr(Date)
  }

  bookedEvents
  { _id :
    booking: Ref(bookings),
      activity: Ref(ActivityModel),
    event: A,
    quantity: Attr(Type.number),
    state: Attr(Enum(“booked”, “pending”)),
    creationdate: Attr(Date)
    isBooked() : if booked || pending creation && date < 15min -> true
  }

  Wenn creationdate älter als 15 min ist, dann kann man booked nicht mehr auf true setzen.

  */

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