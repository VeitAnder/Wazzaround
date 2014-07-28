'use strict';

angular.module('anorakApp')
  .directive('aiotoggleitem', function ($translate) {
    return {
      template: '<div ng-class="{open: state.open}">' +
        '<a ng-click="state.toggle()" class="aiotoggleitemhead"><span>{{toggleitemlabel}}</span><i>?</i></a> ' +
        '<div ng-transclude ng-show="state.open" class="aiotoggleitembody"></div> ' +
        '</div>',
      restrict: 'A',
      transclude: true,
      scope: {
        toggleitemlabel: "@"
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