var config = require('../config.js');
// translations
var translations = config.translations;

var postmark = require('postmark')(config.postmark.apikey);
var Q = require('q');

// set default Language to en
var languageKey = "en";

// setup numeral
var numeral = require('numeral');
var numeralDE = require('numeral/languages/de');
numeralDE.delimiters.thousands = '.';
numeral.language('de', numeralDE);
numeral.language('de');
// example
// numeral(1024).format('0,0.00');

var Handlebars,
  send,
  templatestore;

templatestore = require('../templates/compiled/compiledtemplates.js');


var moment = require('moment-timezone');
moment.locale(languageKey);

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
  //mail.postmarkmail.TextBody = templatestore['default.txt.handlebars.html'](mail.data);

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
      "Subject": "wazzaround – " + translations[languageKey]['Reset your password'],
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
      "Subject": "wazzaround – " + translations[languageKey]['Confirmation of your Registration'],
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
          "Bcc": config.postmark.bcc,
          "Subject": "wazzaround – " + translations[languageKey]['Payment Confirmation'],
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
        "Bcc": config.postmark.bcc,
        "Subject": "wazzaround – " + translations[languageKey]['Payment Confirmation'],
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
