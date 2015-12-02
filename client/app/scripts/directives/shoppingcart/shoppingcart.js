'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart, translationutils) {
    return {
      templateUrl: 'views/directives/shoppingcart/shoppingcart.html',
      restrict: 'E',
      scope: {
        cart: '='
      },
      controller: function shoppingcartCrtl($scope, $element, $attrs) {
        $scope.state = {
          confirmationview: false
        };

        $scope.translationutils = translationutils;

        if ($attrs.confirmationview === "true") {
          $scope.state.confirmationview = true;
        }

        if ($attrs.cart !== undefined) {
          $scope.shoppingcart = $scope.cart;
        } else {
          $scope.shoppingcart = shoppingcart;
        }

      }
    };
  });
