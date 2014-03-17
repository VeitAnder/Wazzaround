'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function () {
    return {
      templateUrl: 'directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        events: '='
      },
      link: function postLink(scope, elem, attrs) {
        console.log("GOT EVENTS", scope.events);
        console.log("ELE", elem);
        console.log("ATTRAS", attrs);
        console.log("SCOPE", scope);

        scope.moment = moment;

        // scope.events = ["Quadfahren", "Segeln"]
        // scope.events[0].ref() = [{Quadfahren am 1.3., am 1.4., am 1.5.}]
      }
    };
  });
