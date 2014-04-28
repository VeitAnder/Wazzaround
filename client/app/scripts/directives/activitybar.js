'use strict';

angular.module('anorakApp')
  .directive('activitybar', function () {
    return {
      templateUrl: 'views/directives/activitybar.html',
      restrict: 'E',
      scope: {
        activities: "=activities"
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
