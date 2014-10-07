'use strict';

/**
 * @ngdoc directive
 * @name anorakApp.directive:mobilenav
 * @description
 * # mobilenav
 */
angular.module('anorakApp')
  .directive('mobilenav', function () {
    return {
      templateUrl: 'views/directives/mobilenav.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.states = {
          open: false
        };

        scope.toggle = function () {
          scope.states.open = !scope.states.open;
        };

      }
    };
  });
