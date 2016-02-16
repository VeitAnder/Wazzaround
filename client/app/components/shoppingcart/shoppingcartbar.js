'use strict';

angular.module('anorakApp')
  .directive('shoppingcartbar', function (shoppingcart, $location, $timeout) {
    return {
      templateUrl: 'components/shoppingcart/shoppingcartbar.html',
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

        scope.toggleShoppingCartBar = function () {
          shoppingcart.states.open = !shoppingcart.states.open;
          setToggleClass();
        };

        scope.closeShoppingCartBar = function () {
          shoppingcart.states.open = false;
          setToggleClass();
        };

        scope.gotoPaymentPage = function () {
          scope.closeShoppingCartBar();
          $timeout(function () {
            $location.path("/payment");
          }, 250);
        };

      }
    };
  });
