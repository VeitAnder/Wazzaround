'use strict';

angular.module('anorakApp')
  .directive('aiotoggleitem', function () {
    return {
      template: '<div ng-class="{open: state.open}">' +
        '<a ng-click="state.toggle()" class="aiotoggleitemhead"><i></i><span>{{state.toggleitemlabel}}</span></a> ' +
        '<div ng-transclude ng-show="state.open" class="aiotoggleitembody"></div> ' +
        '</div>',
      restrict: 'A',
      transclude: true,
      scope: {
      },
      link: function postLink(scope, element, attrs) {
        if (!attrs.toggleitemlabel) {
          attrs.toggleitemlabel = "toggle";
        }

        scope.state = {
          open: false,
          toggleitemlabel: attrs.toggleitemlabel,
          toggle: function () {
            this.open = !this.open;
          }
        };
      }
    };
  });