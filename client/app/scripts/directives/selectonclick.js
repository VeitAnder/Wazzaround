'use strict';

angular.module('anorakApp')
  .directive('selectOnClick', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('click', function () {
          this.select();
        });
      }
    };
  });
