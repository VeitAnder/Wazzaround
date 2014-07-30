'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart, translationutils) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      scope: {
        cart: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.state = {
          confirmationview: false
        };

        scope.translationutils = translationutils;

        if (attrs.confirmationview === "true") {
          scope.state.confirmationview = true;
        }

        if (attrs.cart !== undefined) {
          console.log('scope.cart;', scope.cart);
          scope.shoppingcart = scope.cart;
        } else {
          console.log('shoppingcart;', shoppingcart);
          scope.shoppingcart = shoppingcart;
        }

        scope.$watch("shoppingcart", function (newVal, oldVal) {
          console.log("scope.shoppingcartForm", scope.shoppingcartForm.$setValidity);
          if (shoppingcart.getNumberOfItems() < 1) {
            scope.shoppingcartForm.$setValidity(false);
          } else {
            scope.shoppingcartForm.$setValidity(true);
          }
        }, true);

      }
    };
  });
