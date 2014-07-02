'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      scope: {

      },
      link: function postLink(scope, element, attrs) {
        scope.state = {
          confirmationview: false
        };

        if (attrs.confirmationview === "true") {
          scope.state.confirmationview = true;
        }
        scope.shoppingcart = shoppingcart;
      }
    };
  });
