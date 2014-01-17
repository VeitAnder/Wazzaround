// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
// The AuthenticationService is the public API for this module.  Application developers should only need to use this service and not any of the others here.
angular.module('services.authentication', ['services.authentication.current-user', 'services.authentication.interceptor', 'services.authentication.retry-queue'])
  .factory('AuthenticationService', function ($http, $location, $q, AuthenticationRetryQueue, currentUser, APP_CONFIG) {
    "use strict";

    // TODO: We need a way to refresh the page to clear any data that has been loaded when the user logs out
    //  a simple way would be to redirect to the root of the application but this feels a bit inflexible.
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    function updateCurrentUser(user) {
      currentUser.update(user);
      if (!!user) {
        AuthenticationRetryQueue.retry();
      }
    }

    var service = {
      isLoginRequired: function () {
        return AuthenticationRetryQueue.hasMore();
      },

      getLoginReason: function () {
        return AuthenticationRetryQueue.getReason();
      },

      showLogin: function () {
        // Push a no-op onto the AuthenticationRetryQueue to create a manual login
        AuthenticationRetryQueue.push({
          retry: function () {
          },
          cancel: function () {
          },
          reason: 'user-request'
        });
      },

      login: function (email, password) {
        var request = $http.post(APP_CONFIG.APIUrl + 'login', {email: email, password: password});
        return request.then(function (response) {
          updateCurrentUser(response.data.user);
          return currentUser.isAuthenticated();
        });
      },

      cancelLogin: function (redirectTo) {
        AuthenticationRetryQueue.cancel();
        redirect(redirectTo);
      },

      logout: function () {
        $http.post(APP_CONFIG.APIUrl + 'logout').then(function () {
          // no need to clear currentUser due to reload of angular app
          // currentUser.clear();
          // redirect("/");
          window.location = '/';
        });
      },

      // Ask the backend to see if a users is already authenticated - this may be from a previous session.
      // The app should probably do this at start up
      requestCurrentUser: function () {
        if (currentUser.isAuthenticated()) {
          return $q.when(currentUser);
        } else {
          return $http.get(APP_CONFIG.APIUrl + 'current-user').then(function (response) {
            updateCurrentUser(response.data.user);
            return currentUser;
          });
        }
      },

      requireAuthenticatedUser: function () {
        var promise = service.requestCurrentUser().then(function (currentUser) {
          if (!currentUser.isAuthenticated()) {
            return AuthenticationRetryQueue.pushPromiseFn(service.requireAuthenticatedUser, 'unauthenticated-client');
          }
        });
        return promise;
      },

      requireAdminUser: function () {
        var promise = service.requestCurrentUser().then(function (currentUser) {
          if (!currentUser.isAdmin()) {
            return AuthenticationRetryQueue.pushPromiseFn(service.requireAdminUser, 'unauthorized-client');
          }
        });
        return promise;
      }
    };

    // Get the current user when the service is instantiated
    service.requestCurrentUser();

    return service;
  });