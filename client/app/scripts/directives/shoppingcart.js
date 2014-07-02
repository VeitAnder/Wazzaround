'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function (shoppingcart, translationutils) {
    return {
      templateUrl: 'views/directives/shoppingcart.html',
      restrict: 'E',
      scope: {

      },
      link: function postLink(scope, element, attrs) {
        scope.state = {
          confirmationview: false
        };

        scope.translationutils = translationutils;

        if (attrs.confirmationview === "true") {
          scope.state.confirmationview = true;
        }
        scope.shoppingcart = shoppingcart;
      }
    };
  });
