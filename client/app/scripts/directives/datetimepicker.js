'use strict';

angular.module('anorakApp')
  .directive('datetimepicker', function ($timeout) {
    return {
      templateUrl: 'views/directives/datetimepicker.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.eventcreation = { error: "" };

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

        scope.setEndDate = function () {
          var start = moment(scope.event.start);
          var end = moment(scope.event.end);

          if (start.isAfter(end)) {
            end = moment(start).add('hours', 1);
            scope.event.end = end;
          }
        };

        scope.$watch('event.start', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            console.log("START CHANGED", scope.event.start);
            scope.setEndDate();
          }
        });

        scope.$watch('event.end', function (newVal, oldVal) {
          if (newVal !== oldVal) {
            console.log("END CHANGED", scope.event.start);

            $timeout(function () {
              var start = moment(scope.event.start);
              var end = moment(scope.event.end);

              if (start.isAfter(end)) {
                console.log("START BEFORE END");
                scope.eventcreation.error = "endBeforeStart";
                scope.event.end = start.add(15, 'minutes');

              } else {
                scope.eventcreation.error = "";
              }
            });
          }
        });

        scope.event.end = setTimeToNextFiveMinuteInterval(scope.event.end);

      }
    };
  });
