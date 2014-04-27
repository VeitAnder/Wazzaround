'use strict';

angular.module('anorakApp')
  .directive('shoppingcart', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the shoppingcart directive');
      }
    };
  });
