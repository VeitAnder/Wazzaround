'use strict';

angular.module('anorakApp')
  .directive('uploadform', function () {
    return {
      templateUrl: 'views/directives/uploadform.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
