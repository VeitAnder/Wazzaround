'use strict';

angular.module('anorakApp')
  .directive('buildinfo', function (APP_CLIENTINFO) {
    return {
      templateUrl: 'views/directives/buildinfo.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.APP_CLIENTINFO = APP_CLIENTINFO;
      }
    };
  });
