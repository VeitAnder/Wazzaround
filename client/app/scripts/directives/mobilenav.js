'use strict';

/**
 * @ngdoc directive
 * @name anorakApp.directive:mobilenav
 * @description
 * # mobilenav
 */
angular.module('anorakApp')
  .directive('mobilenav', function ($timeout, $location, shoppingcart) {
    return {
      templateUrl: 'views/directives/mobilenav.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.shoppingcart = shoppingcart;

        scope.states = {
          open: false
        };

        scope.toggle = function () {
          scope.states.open = !scope.states.open;
        };

        scope.gotoPaymentPage = function () {
          $timeout(function () {
            $location.path("/payment");
          }, 0);
        };

      }
    };
  });
