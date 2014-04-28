'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.shoppingcart = shoppingcart;
      }
    };
  });
