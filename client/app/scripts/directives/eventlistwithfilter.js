'use strict';

angular.module('anorakApp')
  .directive('eventListWithFilter', function () {
    return {
      templateUrl: 'views/directives/eventListWithFilter.html',
      restrict: 'E',
      scope: {
        activity: "="
      },
      controller: "EventListFilterCtrl"
    }
  });
