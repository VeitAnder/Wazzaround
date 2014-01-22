'use strict';

angular.module('anorakApp')
  .service('debug', function debug($log, APP_CONFIG, $window) {
    var emptyfunction = function () {
    };
    // AngularJS will instantiate a singleton by calling "new" on this function
    if (APP_CONFIG.debug) {
      $window.debug = $log.log;
      return $log.log;
    } else {
      // do not log anything
      $window.debug = emptyfunction;
      return emptyfunction;
    }
  });