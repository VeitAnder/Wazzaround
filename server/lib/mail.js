var config = require('../config.js');

var postmark = require('postmark')(config.postmark.apikey);
var Q = require('q');

// setup numeral
var numeral = require('numeral');
var numeralDE = require('numeral/languages/de');
numeralDE.delimiters.thousands = '.';
numeral.language('de', numeralDE);
numeral.language('de');
// example
// numeral(1024).format('0,0.00');

var moment = require('moment-timezone');
var Handlebars,
  send;
var templatestore = require('../templates/compiled/compiledtemplates.js');

// translations
var translations = config.translations;
// set default Language to en
var languageKey = "en";

// moment.js language configuration
// language : german (de)
// author : lluchs : https://github.com/lluchs

moment.locale('en');

moment.tz.add({
  "zones": {
    "Europe/Amsterdam": [
      "0:19:32 - LMT 1835 0:19:32",
      "0:19:32 Neth %s 1937_6_1 1:19:32",
      "0:20 Neth NE%sT 1940_4_16_0 0:20",
      "1 C-Eur CE%sT 1945_3_2_2 1",
      "1 Neth CE%sT 1977 1",
      "1 EU CE%sT"
    ],
    "Europe/Vienna": [
      "1:5:21 - LMT 1893_3 1:5:21",
      "1 C-Eur CE%sT 1920 1",
      "1 Austria CE%sT 1940_3_1_2 1",
      "1 C-Eur CE%sT 1945_3_2_2 1",
      "2 - CEST 1945_3_12_2 1",
      "1 - CET 1946 1",
      "1 Austria CE%sT 1981 1",
      "1 EU CE%sT"
    ]
  },
  "rules": {
    "Neth": [
      "1916 1916 4 1 7 0 0 1 NST",
      "1916 1916 9 1 7 0 0 0 AMT",
      "1917 1917 3 16 7 2 2 1 NST",
      "1917 1917 8 17 7 2 2 0 AMT",
      "1918 1921 3 1 1 2 2 1 NST",
      "1918 1921 8 1 8 2 2 0 AMT",
      "1922 1922 2 0 8 2 2 1 NST",
      "1922 1936 9 2 0 2 2 0 AMT",
      "1923 1923 5 1 5 2 2 1 NST",
      "1924 1924 2 0 8 2 2 1 NST",
      "1925 1925 5 1 5 2 2 1 NST",
      "1926 1931 4 15 7 2 2 1 NST",
      "1932 1932 4 22 7 2 2 1 NST",
      "1933 1936 4 15 7 2 2 1 NST",
      "1937 1937 4 22 7 2 2 1 NST",
      "1937 1937 6 1 7 0 0 1 S",
      "1937 1939 9 2 0 2 2 0",
      "1938 1939 4 15 7 2 2 1 S",
      "1945 1945 3 2 7 2 2 1 S",
      "1945 1945 8 16 7 2 2 0"
    ],
    "C-Eur": [
      "1916 1916 3 30 7 23 0 1 S",
      "1916 1916 9 1 7 1 0 0",
      "1917 1918 3 15 1 2 2 1 S",
      "1917 1918 8 15 1 2 2 0",
      "1940 1940 3 1 7 2 2 1 S",
      "1942 1942 10 2 7 2 2 0",
      "1943 1943 2 29 7 2 2 1 S",
      "1943 1943 9 4 7 2 2 0",
      "1944 1945 3 1 1 2 2 1 S",
      "1944 1944 9 2 7 2 2 0",
      "1945 1945 8 16 7 2 2 0",
      "1977 1980 3 1 0 2 2 1 S",
      "1977 1977 8 0 8 2 2 0",
      "1978 1978 9 1 7 2 2 0",
      "1979 1995 8 0 8 2 2 0",
      "1981 9999 2 0 8 2 2 1 S",
      "1996 9999 9 0 8 2 2 0"
    ],
    "EU": [
      "1977 1980 3 1 0 1 1 1 S",
      "1977 1977 8 0 8 1 1 0",
      "1978 1978 9 1 7 1 1 0",
      "1979 1995 8 0 8 1 1 0",
      "1981 9999 2 0 8 1 1 1 S",
      "1996 9999 9 0 8 1 1 0"
    ],
    "Austria": [
      "1920 1920 3 5 7 2 2 1 S",
      "1920 1920 8 13 7 2 2 0",
      "1946 1946 3 14 7 2 2 1 S",
      "1946 1948 9 1 0 2 2 0",
      "1947 1947 3 6 7 2 2 1 S",
      "1948 1948 3 18 7 2 2 1 S",
      "1980 1980 3 6 7 0 0 1 S",
      "1980 1980 8 28 7 0 0 0"
    ]
  },
  "links": {}
});

//include precompiled (via grunt task) handlebars templates
Handlebars = require('handlebars');

//  format an ISO date using Moment.js
//  http://momentjs.com/
//  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
//  usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function (context, block) {
  var f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
  return moment(context).tz("Europe/Vienna").format(f); //had to remove Date(context)
});

// {{duration start end}}
Handlebars.registerHelper('duration', function (start, end) {
  return moment.duration(moment(start) - moment(end)).humanize();
});

//  format numbers using numeral.js
//  http://numeraljs.com/
//  moment syntax example: numeral(100).format('0.0,00')
//  usage: {{numeral amount format="0.0,00"}}
Handlebars.registerHelper('numeral', function (number, block) {
  var f = block.hash.format || "0,0.00 $";
  return numeral(number).format(f);
});

Handlebars.registerHelper('readableid', function (objectid, block) {
  return objectid.toString().match(/.{1,4}/g).join("-");
});

Handlebars.registerHelper('host', function (context, block) {
  return config.host;
});

Handlebars.registerHelper('translate', function (text, block) {
  // translate translates documents from the DB, can't be sure that an translation exists so use fallbacks.
  if (text[languageKey]) {
    return text[languageKey];
  } else if (text.en) {
    return text.en;
  } else if (text.de) {
    return text.de;
  } else if (text.it) {
    return text.it;
  } else if (text.fr) {
    return text.fr;
  }
});

Handlebars.registerHelper('translations', function (key, block) {
  if (block.hash) {
    // interpolate hash keys
    var template = Handlebars.compile(translations[languageKey][key]);
    var context = block.hash;
    return template(context);
  } else {
    return translations[languageKey][key];
  }
});

send = function (mail) {
  var deferred = Q.defer();

  mail.postmarkmail.HtmlBody = templatestore['default.handlebars.html'](mail.data);

  postmark.send(mail.postmarkmail, function (error, success) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(success);
    }
  });

  return deferred.promise;
};
exports.send = send;

exports.sendResetPasswordMail = function (user, token, langKey) {
  languageKey = langKey;

  //E-Mail Body
  var sendmessage = {
    data: {
      user: user,
      token: token,
      resetpwdurl: config.clienthost + "registration/forgotpassword/" + token + "/" + user.email + "/",
      template: {
        resetpassword: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": user.email,
      "Subject": "reacture – " + translations[languageKey]['Reset your password'],
      "Tag": "resetpassword",
      "ReplyTo": config.postmark.replyto
    }
  };

  return send(sendmessage);
};

exports.sendActivationTokenEmail = function (token, langKey) {
  languageKey = langKey;

  //E-Mail Body
  var sendmessage = {
    data: {
      user: token.user.ref(),
      activationurl: config.host + config.api.apiversion + "users/" + token.user.ref()._id + "/activate/" + token._id + "/" + token.token + "/",
      template: {
        accountactivationtoken: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": token.user.ref().email,
      "Subject": "reacture – " + translations[languageKey]['Confirmation of your Registration'],
      "Tag": "accountactivationtoken",
      "ReplyTo": config.postmark.replyto
    }
  };

  return send(sendmessage);
};

exports.sendBookingConfirmationEmailToCustomer = function (booking) {
  var populateActivityOwnersPromises = [];

  languageKey = booking.languageKey;

  // populate activity.owner in bookedEvent.activity
  // @TODO use modelizer for this
  booking.bookedEvents.forEach(function (bookedEvent) {
    populateActivityOwnersPromises.push(
      bookedEvent.activity.owner.load()
        .then(function (owner) {
          bookedEvent.activity.activityowner = owner;
        })
    );
  });

  return Q.all(populateActivityOwnersPromises)
    .then(function () {
      //E-Mail Body
      var sendmessage = {
        data: {
          bookingData: booking,
          template: {
            bookingconfirmationtocustomer: true
          }
        },
        postmarkmail: {
          "From": config.postmark.from,
          "To": booking.booking.profile.email,
          "Subject": "reacture – " + translations[languageKey]['Payment Confirmation'],
          "Tag": "accountactivationtoken",
          "ReplyTo": config.postmark.replyto
        }
      };
      return send(sendmessage);
    });
};

exports.sendBookingConfirmationEmailToProviders = function (booking) {
  languageKey = booking.languageKey;

  // Split all bookedEvents into single emails
  booking.bookedEvents.forEach(function (bookedEvent) {
    //E-Mail Body
    var sendmessage = {
      data: {
        bookingData: booking,
        bookedEvent: bookedEvent,
        template: {
          bookingconfirmationtoprovider: true
        }
      },
      postmarkmail: {
        "From": config.postmark.from,
        "To": "test@planfredapp.com",
        "Subject": "reacture – " + translations[languageKey]['Payment Confirmation'],
        "Tag": "accountactivationtoken",
        "ReplyTo": config.postmark.replyto
      }
    };

    bookedEvent.activity.owner.load()
      .then(function (owner) {
        sendmessage.postmarkmail.To = owner.email;
        send(sendmessage);
      });
  });
};
