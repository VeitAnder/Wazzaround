'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart, $timeout) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.shoppingcart = shoppingcart;

        scope.states = {
          checkoutinprogress: false
        };

        scope.checkout = function () {
          if (scope.states.checkoutinprogress && shoppingcart.getTotal().num < 1) {
            return;
          }

          scope.states.checkoutinprogress = true;

          shoppingcart.checkout()
            .then(function (result) {

              $timeout(function () {
                scope.states.checkoutinprogress = false;
              }, 40000);

              // empty basket
              // redirect to kalixa

            });
        };

      }
    };
  });
