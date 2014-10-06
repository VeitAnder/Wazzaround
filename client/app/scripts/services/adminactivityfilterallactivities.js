'use strict';

/**
 * @ngdoc service
 * @name anorakApp.adminActivityFilter
 * @description
 * # adminActivityFilter
 * Service in the anorakApp.
 */
angular.module('anorakApp')
  .factory('adminActivityFilterAllActivities', function adminActivityFilterAllActivities(adminActivityFilter) {
    return new adminActivityFilter();
  });
