'use strict';

var models = function () {
  var model;

  // modelizer fork hack
  if (typeof window === 'undefined') {
    model = require('modelizerfork');
  } else {
    // in browser, modelizerfork is called modelizer (original non forked name)
    model = require('modelizer');
  }

  var Attr = model.Attr;
  var VirualAttr = model.VirtualAttr;
  var Type = model.Attr.Types;
  var Ref = model.Ref;
  var ObjArray = model.ObjArray;
  var Operation = model.Operation;
  var Factory = model.Factory;
  var Link = model.Link;
  var Method = model.Method;
  var RefArray = model.RefArray;

  var validators = {
    email: function (value) {
      if (value === undefined || value === null || value === "") {
        throw new Error("you have to provide a username (it is empty)");
      }
      return value;
    }
  };

  // TODO alle properties die im Client required sind,
  // custom validator schreiben:
  // check auf userType, wenn provider sind bestimmte Felder aus profile required,
  // bei normalem User kein profile nötig
  // Businesslogic, Methode zur Validierung schreiben
  var UserModel = new model("users", {
    email: Attr(Type.string, validators.email),  // email ist auch username
    password: Attr(Type.string),
    registrationdate: Attr(Type.date, Attr.default(new Date())),
    lastlogindate: Attr(Type.date),
    enabled: Attr(Type.boolean, Attr.default(true)),
    emailconfirmed: Attr(Type.boolean, Attr.default(false)),
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
      mobile: Attr(Type.string),
      country: {
        "code": Attr(Type.string),
        "name": Attr(Type.string)
      },
      contactperson: {
        name: Attr(Type.string)
      }
    },
    bankaccount: {
      bank: Attr(Type.string),
      iban: Attr(Type.string),
      bic: Attr(Type.string),
      nameofaccountowner: Attr(Type.string)
    },
    paypal: {
      email: Attr(Type.string)
    },
    preferredBankingAccount: Attr(Type.string, Type.enum('bankaccount', 'paypal'), Attr.default('bankaccount')),

    login: Operation(),
    logout: Operation(),
    register: Operation(),

    userType: Attr(Type.string, Type.enum('user', 'admin', 'provider'), Attr.default('user')),
    acl: {
      sales: Attr(Type.boolean, Attr.default(false))
    },

    currentUser: Factory(),
    getProviders: Factory(),
    getMyPromotedUsers: Operation(),

    getProfile: Operation(),
    enteredpromocode: Attr(Type.string)
  });

  var PromotionModel = new model("promotion", {
    promocode: Attr(Type.string),
    acquiredproviders: RefArray(UserModel)
  });

  UserModel.attrObj("promotion", PromotionModel);

  var EventModel = new model("events", {
    bookingEndsAt: Attr(Type.date), // auto-calculated at write-filter time from bookingEndsHoursBeforeStart
    bookingEndsHoursBeforeStart: Attr(Type.number, Attr.default(1)),
    start: Attr(Type.date),
    end: Attr(Type.date),
    quantity: Attr(Type.number, Attr.default(1)), // gets overwritten by afterReadFilter in case of groupEvent
    availableQuantity: VirualAttr(Type.number), // wird von afterReadFilter berechnet/aktualisiert
    price: Attr(Type.number),
    groupEvent: Attr(Type.boolean, Attr.default(false)),
    groupMinPersons: Attr(Type.number),
    groupMaxPersons: Attr(Type.number),
    priceForGroupEvent: Attr(Type.number),
    priceForAdditionalPerson: Attr(Type.number)
  });

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
    address: Attr(Type.string),

    description: {
      en: Attr(Type.string),
      de: Attr(Type.string),
      it: Attr(Type.string)
    },

    shortdescription: {
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

    // TODO security: der user könnte das hier schon auf true setzen
    published: Attr(Type.boolean, Attr.default(false)),
    unreviewedChanges: Attr(Type.number, Attr.default(0)),
    denied: Attr(Type.boolean, Attr.default(false)),

    // http://docs.mongodb.org/manual/core/geospatial-indexes/#multi-location-documents-for-2d-indexes
    // http://myadventuresincoding.wordpress.com/2011/10/02/mongodb-geospatial-queries/
    // don' forget to create an index via:
    //  db.activities.ensureIndex( {"location" : "2d"} );
    location: {
      lng: Attr(Type.number),
      lat: Attr(Type.number)
    },

    bookableItems: ObjArray(BookableItemModel),

    owner: Ref(UserModel),

    getMyActivities: Factory(),
    byOwner: Factory(),

    filteredActivities: Factory({
      from: {  // <bottom left coordinates>
        lng: Attr(Type.number),
        lat: Attr(Type.number)
      },
      to: {  // <upper right coordinates>
        lng: Attr(Type.number),
        lat: Attr(Type.number)
      },
      startDate: Attr(Type.date),
      endDate: Attr(Type.date)
    })
  });

  var BookingModel = new model('bookings', {
    user: Ref(UserModel),  // welcher user hat gebucht - optional falls vorhanden
    // bookingId: Attr(Type.string), // _id is used as booking id
    transactionId: Attr(Type.string),  // the transaction id from the payment provider
    state: Attr(Type.string, Type.enum('booked', 'pending'), Attr.default('pending')),
    date: Attr(Type.date, Attr.default(new Date())),

    profile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      email: Attr(Type.string),
      tel: Attr(Type.string)
    },

    payment: {
      amount_int: Attr(Type.number),
      currency: Attr(Type.string)
    },

    checkout: Operation({
      bookings: [
        {
          activity: Attr(Type.objectid),
          item: Attr(Type.objectid),
          event: Attr(Type.objectid),
          quantity: Attr(Type.number)
        }
      ],
      profile: {
        firstName: Attr(Type.string),
        lastName: Attr(Type.string),
        email: Attr(Type.string),
        tel: Attr(Type.string)
      },
      payment: {
        amount_int: Attr(Type.number),
        paymentToken: Attr(Type.string)
      }
    })  // returns { bookingID : .., state: 'ok' }

  });

  // This Model represents the booking of one Event
  var BookedEventModel = new model('bookedEvents', {
    booking: Ref(BookingModel),                       // zu dieser Buchung gehört das Event
    activity: Ref(ActivityModel),                      // gebuchte Aktivität
    activity_owner: Ref(UserModel),                  // der Besitzer der Aktivität
    item: Link(ActivityModel, BookableItemModel),  // gebuchtes Item
    event: Link(ActivityModel, EventModel),         // gebuchtes Event
    quantity: Attr(Type.number),                       // gebuchte Menge

    activityCopy: ActivityModel,  // kopie der Aktivität zum Buchungszeitpunkt

    date: Attr(Type.date, Attr.default(new Date())),  // wann wurde das event gebucht

    bookingProfile: {
      firstName: Attr(Type.string),
      lastName: Attr(Type.string),
      email: Attr(Type.string),
      tel: Attr(Type.string)
    },

    bookedQuantity: Operation({    // wie oft wurde ein best. Event gebucht
      event: Attr(Type.objectid)
    }),  // returns { quantity : X }

    // price for this booking
    totalPrice: Method(function () {
      // @TODO - calculate total price based on group event data or single event data
      return this.event.price * this.quantity;
    })

    // gebucht ist das Event wenn, state = 'booked' oder state = 'pending' und date < 15min
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
    "setNewPassword": Operation(),
    "isExpired": Method(function () {
      return this.expires < new Date();
    })
  });

  return {
    UserModel: UserModel,
    ActivityModel: ActivityModel,
    CategoryModel: CategoryModel,
    BookableItemModel: BookableItemModel,
    BookingModel: BookingModel,
    AccesstokenModel: AccesstokenModel,
    EventModel: EventModel,
    BookedEventModel: BookedEventModel
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
