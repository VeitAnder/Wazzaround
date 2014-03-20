// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication.current-user', [])
  .factory('currentUser', function ($rootScope, $q, models) {
    "use strict";

    var currentUser = {
      load: function () {
        // don't load if already loaded
        if (currentUser.user) {
          var defer = $q.defer();
          defer.resolve(currentUser);
          return defer.promise;
        }

        return models.UserModel.currentUser()
          .then(function (user) {
            currentUser.user = user;
            currentUser.authenticated = true;
            $rootScope.$apply();
            return currentUser;
          })
          .fail(function (err) {
            // user has not been logged in
            return currentUser;
          });
      },

      user: null,

      login: function (email, password) {
        return models.UserModel.login({email: email, password: password})
          .then(function (res) {
            return currentUser.load();
          });
      },

      register: function (email, password) {
        return models.UserModel.register({
          email: email,
          password: password
        })
          .then(function (res) {
            return currentUser.login(email, password);
          });
      },

      logout: function () {
        return models.UserModel.logout()
          .then(function (res) {
            currentUser.user = null;
            currentUser.authenticated = false;
            $rootScope.$apply();
          });
      },

      authenticated: false
    };

    return currentUser;
  });