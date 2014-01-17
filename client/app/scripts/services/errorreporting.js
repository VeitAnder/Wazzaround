angular.module('anorakApp')
  .factory('errorreporting', function (APP_CONFIG, $http, userAgent, $window) {
    "use strict";
    var url = APP_CONFIG.APIUrl;
    var maxcounter = 10;
    var log = function (msg) {
      if (maxcounter < 0) {
        return;
      }
      maxcounter = maxcounter - 1;
      $http.post(url + "logging", { client: msg });
    };

    // setup global error handler
    $window.onerror = function (errorMsg, url, lineNumber) {
      log({
        errorMsg: errorMsg,
        url: url,
        lineNumber: lineNumber,
        browser: userAgent.getBrowser(),
        os: userAgent.getOS(),
        ua: userAgent.getUA()
      });
      return false;
    };
    return log;
  });

angular.module('anorakApp')
  .factory('$exceptionHandler', function ($log, $window) {
    "use strict";
    return function (exception, cause) {
      $log.error.apply($log, arguments);
      $window.onerror({
        exception: exception,
        cause: cause
      });
    };
  });