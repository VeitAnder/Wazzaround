'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (Shoppingcart) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
