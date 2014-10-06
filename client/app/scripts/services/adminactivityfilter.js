'use strict';

/**
 * @ngdoc service
 * @name anorakApp.adminActivityFilter
 * @description
 * # adminActivityFilter
 * Service in the anorakApp.
 */
angular.module('anorakApp')
  .factory('adminActivityFilter', function adminActivityFilter() {

    var adminActivityFilterState = function () {
      var self = this;

      this.reset = function () {
        self.query = '';
        self.publishedState = "all";
        self.unreviewedChanges = false;
        self.denied = false;
      };

      this.query = "";
      this.publishedState = "all";
      this.unreviewedChanges = false;
      this.denied = false;
    };

    return adminActivityFilterState;
  });
