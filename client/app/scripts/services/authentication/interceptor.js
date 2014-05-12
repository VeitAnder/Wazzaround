"use strict";
// checkout interceptors implementation
// @ http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
angular.module('services.authentication.interceptor', [])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthenticationInterceptor');
  })
  .factory('AuthenticationInterceptor', function (debug, $q, $window) {

    var myInterceptor = {
      response: function (response) {
        return response;
      },
      responseError: function (response) {

        // @TODO implement session recovery according to
        // http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/

        // Session has expired
        if (response.status === 401) {
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
        else if (response.status === 0) {
          debug("no network connection");
        }

        return $q.reject(response);
      }
    };

    return myInterceptor;
  });