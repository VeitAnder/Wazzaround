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

          },
          post: function postLink(scope, iElement, iAttrs, controller) {

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
              if (moment(scope.event.start).isAfter(moment(scope.event.end))) {
                $timeout(function () {
                  // don't assign new Object, instead alter existing date object
                  scope.event.end = moment(moment(scope.event.start)).add('hours', 1).toDate();
                });
              }
            };

            scope.$watch('event.start', function (newDate, oldDate) {
              if (newDate !== oldDate) {
                scope.setEndDate();
              }
            });

            scope.$watch('event.end', function (newDate, oldDate) {
              if (newDate !== oldDate) {
                var start = moment(scope.event.start);
                var end = moment(scope.event.end);

                if (start.isAfter(end)) {
                  // don't assign new Object, instead alter existing date object
                  $timeout(function () {
                    scope.event.end = start.add(15, 'minutes').toDate();
                  });
                }

              }
            });

            scope.getMinTimeForEndTime = function () {
              // @TODO check is wrong ---
              if (moment(scope.event.start).diff(moment(scope.event.end), 'days') > -1) {
                console.log("the same day");
                // same day - apply hours rules
                var hours = moment(scope.event.start).hours();
                var minutes = moment(scope.event.start).minutes();
                if (hours < 10) {
                  hours = "0" + hours;
                }
                if (minutes < 10) {
                  minutes = "0" + minutes;
                }
                return hours + ":" + minutes;
              } else {
                console.log("the day before");
                return "00:00";
              }
            };

          }
        };
      }
    };

  });
