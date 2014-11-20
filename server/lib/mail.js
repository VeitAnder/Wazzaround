var config = require('../config.js');

var postmark = require('postmark')(config.postmark.apikey);
var Q = require('q');
var numeral = require('numeral');
var moment = require('moment-timezone');
var Handlebars,
  templatestore,
  send;

// moment.js language configuration
// language : german (de)
// author : lluchs : https://github.com/lluchs

moment.locale('de', {
  months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
  monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
  weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
  weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
  weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
  longDateFormat: {
    LT: "H:mm U\\hr",
    L: "DD.MM.YYYY",
    LL: "D. MMMM YYYY",
    LLL: "D. MMMM YYYY LT",
    LLLL: "dddd, D. MMMM YYYY LT"
  },
  calendar: {
    sameDay: "[Heute um] LT",
    sameElse: "L",
    nextDay: '[Morgen um] LT',
    nextWeek: 'dddd [um] LT',
    lastDay: '[Gestern um] LT',
    lastWeek: '[letzten] dddd [um] LT'
  },
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: "ein paar Sekunden",
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tagen",
    M: "einem Monat",
    MM: "%d Monaten",
    y: "einem Jahr",
    yy: "%d Jahren"
  },
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
});

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

//  format numbers using numeral.js
//  http://numeraljs.com/
//  moment syntax example: numeral(100).format('0.0,00')
//  usage: {{numeral amount format="0.0,00"}}
Handlebars.registerHelper('numeral', function (number, block) {
  var f = block.hash.format || "0.0,00";
  return numeral(number).format(f);
});

Handlebars.registerHelper('host', function (context, block) {
  return config.host;
});

Handlebars.registerHelper('filename', function (file, block) {
  if (file !== undefined && file.filename !== undefined) {
    return file.filename;
  }
});

Handlebars.registerHelper('filetypeending', function (file, block) {
  if (file !== undefined && file.filename !== undefined) {
    return file.filename.split('.').pop();
  }
});

var languageKey = "en";
Handlebars.registerHelper('translate', function (text, block) {
  return text[languageKey];
});

templatestore = require('../templates/compiled/compiledtemplates.js');

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

exports.sendProjectInvitationMailToUnconfirmedAccount = function (userwhoinvitesparticipant, userAccountOfParticipant, project, newpassword) {
  var sendmessage = {
    data: {
      invitee: userAccountOfParticipant,
      user: userwhoinvitesparticipant.toJSON(),
      project: project,
      version: config.api.apiversion,
      template: {
        projectinvitation: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": userAccountOfParticipant.email,
      "Subject": "reacture – Projekteinladung",
      "Tag": "projectinvitation",
      "ReplyTo": userwhoinvitesparticipant.email
    }
  };

  //if account has not been confirmed yet, include confirmation link
  sendmessage.data.template.includeactivationlink = true;
  sendmessage.data.activationurl = config.host + config.api.apiversion + "userregistrations/confirmuserregistration/" + userAccountOfParticipant.accountconfirmationtoken + "/";
  //also include new password:
  sendmessage.data.password = newpassword;

  return send(sendmessage);
};

exports.sendResetPasswordMail = function (user, token) {
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
      "Subject": "Reacture - reset your password",
      "Tag": "resetpassword",
      "ReplyTo": config.postmark.replyto
    }
  };

  return send(sendmessage);
};

exports.sendActivationTokenEmail = function (token) {
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
      "Subject": "reacture – Bestätigung der Registrierung",
      "Tag": "accountactivationtoken",
      "ReplyTo": config.postmark.replyto
    }
  };

  return send(sendmessage);
};

exports.sendBookingConfirmationEmail = function (booking) {
  languageKey = booking.languageKey;

  //E-Mail Body
  var sendmessage = {
    data: {
      bookingData: booking,
      template: {
        bookingconfirmation: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": booking.booking.profile.email,
      "Subject": "reacture – Bestätigung ihrer Buchung",
      "Tag": "accountactivationtoken",
      "ReplyTo": config.postmark.replyto
    }
  };

  return send(sendmessage);
};
