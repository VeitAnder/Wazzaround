angular.module('directives.downloadlink', [])
  .directive('downloadlink', function ($parse, $timeout) {
    "use strict";

    return {
      restrict: 'A',
      templateUrl: 'directives/downloadlink.tpl.html',
      replace: true,
      scope: {
        downloadrevision: '&',
        filename: '@',
        type: '@',
        update: '@',
        planid: '@'
      },

      link: function (scope, elem, attrs) {

        scope.showcontextmenu = false;
        elem.bind('contextmenu', function (event) {
          event.preventDefault();

          scope.showcontextmenu = true;

          angular.element(elem[0].querySelector('.contextmenu')).css({
            top: event.layerY + "px",
            left: event.layerX + "px",
            width: "200px"
          });

          $timeout(function () {
            scope.$apply();
          });
        });

        elem.bind('mouseleave', function () {
          scope.showcontextmenu = false;
          $timeout(function () {
            scope.$apply();
          });
        });

      }
    };
  });