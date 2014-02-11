// The current user.  You can watch this for changes due to logging in and out
angular.module('services.authentication.current-user', [])
  .factory('currentUser', function ($rootScope, $q) {
    "use strict";

    var currentUser = {
      load: function () {
        // don't load if already loaded
        if (currentUser.user) {
          var defer = $q.defer();
          defer.resolve(currentUser);
          return defer.promise;
        }

        return UserModel.use.all()
          .then(function (users) {
            if (users.length > 0) {
              currentUser.user = users[0];
              currentUser.authenticated = true;
              $rootScope.$apply();
              return currentUser;
            }
          })
          .fail(function (err) {
            // user has not been logged in
            return currentUser;
          });
      },

      user: null,

      login: function (username, password) {
        return UserModel.login({username: username, password: password})
          .then(function (res) {
            return currentUser.load();
          });
      },

      register: function (username, password) {
        return UserModel.register({
          username: username,
          password: password
        })
          .then(function (res) {
            return currentUser.login(username, password);
          });
      },

      logout: function () {
        return UserModel.logout()
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