'use strict';

angular.module('anorakApp')
  .directive('shoppingcartbar', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/shoppingcartbar.html',
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

        scope.toggleShoppingCart = function () {
          shoppingcart.states.open = !shoppingcart.states.open;
          setToggleClass();
        };

      }
    };
  });
