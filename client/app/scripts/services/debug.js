'use strict';

angular.module('anorakApp')
  .service('debug', function debug($log, APP_CONFIG) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    if (APP_CONFIG.debug){
      return $log.log;
    } else {
      // do not log anything
      return function () {};
    }
  });