'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart, $timeout) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var setToggleClass = function () {
          if (shoppingcart.states.open) {
            element.addClass("active");
          } else {
            element.removeClass("active");
          }
        };
        setToggleClass();

        scope.shoppingcart = shoppingcart;

        scope.states = {
          checkoutinprogress: false
        };

        scope.toggleShoppingCart = function () {
          shoppingcart.states.open = !shoppingcart.states.open;
          setToggleClass();
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
