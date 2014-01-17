// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication.current-user', [])
  .factory('currentUser', function () {
    "use strict";

    var userInfo = null;
    var currentUser = {
      updateProfile: function (profile) {
        userInfo.profile = profile;
      },
      update: function (info) {
        userInfo = info;
      },
      clear: function () {
        userInfo = null;
      },
      info: function () {
        return userInfo;
      },
      isAuthenticated: function () {
        return !!userInfo;
      },
      isGoodwillMode: function () {
        if (userInfo === null) {
          return false;
        }
        if (userInfo.payment !== undefined && userInfo.payment.firstproject) {
          var diff = moment().diff(moment(userInfo.payment.firstproject), 'days');
          if (diff >= userInfo.payment.trialperioddays) {
            return true;
          }
        }
        return false;
      }
    };

    return currentUser;
  });