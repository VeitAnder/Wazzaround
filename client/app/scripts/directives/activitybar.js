'use strict';

angular.module('anorakApp')
  .directive('activitybar', function () {
    return {
      templateUrl: 'views/directives/activitybar.html',
      restrict: 'E',
      scope: {
        activities: "=activities"
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, element, attrs, controller) {

            scope.getCurrentActivity = function () {
              return _.find(scope.activities, { 'selected': true });
            };

          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };

      }
    };
  });
