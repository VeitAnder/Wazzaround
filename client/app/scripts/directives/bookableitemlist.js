'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function () {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        // scope.events = ["Quadfahren", "Segeln"]
        // scope.events[0].ref().events = Quadfahren am 1.3., am 1.4., am 1.5.
        events: '=',
        itemsperpage: '='
      },
      link: function postLink(scope, elem, attrs) {

        scope.moment = moment;

        if(!scope.itemsperpage) {
          scope.itemsperpage = scope.events.length;
        }

      }
    };
  });
