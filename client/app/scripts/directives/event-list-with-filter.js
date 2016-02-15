'use strict';

angular.module('anorakApp')
  .directive('eventListWithFilter', function () {
    return {
      templateUrl: 'views/directives/event-list-with-filter.html',
      restrict: 'E',
      scope: {
        activity: "="
      },
      controller: "EventListFilterCtrl"
    };
  });
