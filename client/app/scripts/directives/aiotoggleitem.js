'use strict';

angular.module('anorakApp')
  .directive('aiotoggleitem', function () {
    return {
      template: '<div ng-class="{open: state.open}">' +
        '<a ng-click="state.toggle()"><span>toggle</span></a> ' +
        '<div ng-transclude ng-show="state.open"></div> ' +
        '</div>',
      restrict: 'A',
      transclude: true,
      scope: {
      },
      link: function postLink(scope, element, attrs) {
        scope.state = {
          open: false,
          toggle: function () {
            this.open = !this.open;
          }
        };
      }
    };
  });
