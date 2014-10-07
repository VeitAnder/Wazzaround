'use strict';

/**
 * @ngdoc service
 * @name anorakApp.mediaquery
 * @description
 * # mediaquery
 * Service in the anorakApp.
 */
angular.module('anorakApp')
  .factory('mediaquery', function mediaquery($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var queries = {
      isNoCols: function () {
        return $window.innerWidth < 768;
      }
    };

    return queries;
  });
