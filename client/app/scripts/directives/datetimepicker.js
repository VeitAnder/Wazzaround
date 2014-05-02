'use strict';

angular.module('anorakApp')
  .directive('datetimepicker', function ($timeout) {
    return {
      templateUrl: 'views/directives/datetimepicker.html',
      restrict: 'E',
      scope: {
        event: "=event"
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, element, attrs, controller) {

            function setTimeToNextFiveMinuteInterval(dateTime) {
              var time = moment(dateTime);
              var restmin = time.minute() % 15;
              var addmin = 0;
              if (restmin > 0) {
                addmin = 15 - restmin;
                time.minute(time.minute() + addmin);
              }
              return time.toDate();
            }

            // start ist nach end - setze end auf start + 1h
            scope.event.start = setTimeToNextFiveMinuteInterval(scope.event.start);
            scope.event.end = setTimeToNextFiveMinuteInterval(scope.event.end);

            scope.setEndDate = function () {
              $timeout(function () {
                if (moment(scope.event.start).isAfter(moment(scope.event.end))) {
                  scope.event.end = moment(moment(scope.event.start)).add('hours', 1).toString();
                }
                scope.$apply();
              });
            };

            scope.$watch('event.start', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                scope.setEndDate();
              }
            });

            scope.$watch('event.end', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                var start = moment(scope.event.start);
                var end = moment(scope.event.end);

                $timeout(function () {
                  if (start.isAfter(end)) {
                    scope.event.end = start.add(15, 'minutes').toString();
                  }

                  scope.$apply();
                });
              }
            });

            scope.getMinTimeForEndTime = function () {
              var hours = moment(scope.event.start).hours();
              var minutes = moment(scope.event.start).minutes();
              if (hours < 10) {
                hours = "0" + hours;
              }
              if (minutes < 10) {
                minutes = "0" + minutes;
              }
              return hours + ":" + minutes;
            };

          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };
      }
    };

  });
