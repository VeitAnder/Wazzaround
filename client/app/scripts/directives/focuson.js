'use strict';

angular.module('anorakApp')
  .directive('focuson', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, elem, attrs) {
        scope.$on('$typeahead.select', function (check) {
          elem[0].focus();
        });
      }
    };
  });