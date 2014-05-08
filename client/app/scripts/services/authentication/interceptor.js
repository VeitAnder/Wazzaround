"use strict";
// This http interceptor listens for authentication failures
angular.module('services.authentication.interceptor', ['services.authentication.retry-queue'])
  .factory('AuthenticationInterceptor', function ($rootScope, $injector, $window, debug) {

    var $http; // To be lazy initialized to prevent circular dependency
    return function (promise) {
      $http = $http || $injector.get('$http');

      // Intercept failed requests
      return promise.then(function (originalResponse) {
        return originalResponse;
      }, function (originalResponse) {
        if (originalResponse.status === 401) {
          debug("session expired detected in AuthenticationInterceptor");
          // The request bounced because it was not authorized - add a new request to the retry queue
          // promise = queue.pushPromiseFn(function() { return $http(originalResponse.config); }, 'unauthorized-server');
          var redirect = "&redirect=";

          // THIS STUFF PREVENTS DEBUGGING!!!
          if ($window.location.search && $window.location.search.length > 0 && $window.location.search.indexOf("redirect=") !== -1) {
            var redirectString = "redirect=";
            var searchIndexStart = $window.location.search.indexOf(redirectString) + redirectString.length;
            redirect = redirect + $window.location.search.substring(searchIndexStart, $window.location.search.length);
          } else {
            redirect = redirect + $window.location.pathname && $window.location.pathname.length > 0 ? "&redirect=" + $window.location.pathname : "";
          }

          $window.location.href = "/login?error=sessionExpired" + redirect;  // , ticket find out about route change error
        }
        else if (originalResponse.status === 0) {
          debug("no network connection");
        }
        return promise;
      });
    };
  });

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
angular.module('services.authentication.interceptor')
  .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('AuthenticationInterceptor');
  });