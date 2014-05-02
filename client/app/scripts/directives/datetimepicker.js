'use strict';

angular.module('anorakApp')
  .directive('datetimepicker', function ($timeout) {
    return {
      templateUrl: 'views/directives/datetimepicker.html',
      restrict: 'E',
      scope: {
        event: "=event"
      },
      link: function postLink(scope, element, attrs) {

        function setTimeToNextFiveMinuteInterval(dateTime) {
          var time = moment(dateTime);
          var restmin = time.minute() % 5;
          var addmin = 0;
          if (restmin > 0) {
            addmin = 5 - restmin;
            time.minute(time.minute() + addmin);
          }
          return time.toDate();
        }

        // start ist nach end - setze end auf start + 1h
        scope.event.start = setTimeToNextFiveMinuteInterval(scope.event.start);
        scope.event.end = setTimeToNextFiveMinuteInterval(scope.event.end);

        scope.setEndDate = function () {
          if (moment(scope.event.start).isAfter(moment(scope.event.end))) {
            scope.event.end = moment(moment(scope.event.start)).add('hours', 1).toString();
          }
        };

        scope.$watch('event.start', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            scope.setEndDate();
          }
        });

        scope.$watch('event.end', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            $timeout(function () {
              var start = moment(scope.event.start);
              var end = moment(scope.event.end);

              if (start.isAfter(end)) {
                scope.event.end = start.add(15, 'minutes').toString();
              }
            });
          }
        });

      }
    };
  });
