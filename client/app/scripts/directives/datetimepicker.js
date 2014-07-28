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

            // get days, hours and minutes from end time
            var duration = moment.duration(moment(scope.event.end) - moment(scope.event.start));
            scope.event.durationdays = duration.days();
            scope.event.durationhours = duration.hours();
            scope.event.durationminutes = duration.minutes();

            var getEndDate = function () {
              var endDate = new moment(scope.event.start);
              endDate.add('days', scope.event.durationdays);
              endDate.add('hours', scope.event.durationhours);
              endDate.add('minutes', scope.event.durationminutes);
              return endDate;
            };

            var updateEndDate = function () {
              scope.event.end = getEndDate().toDate();
            };

            scope.$watch('event.durationdays', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                updateEndDate();
              }
            }, true);

            scope.$watch('event.durationhours', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                updateEndDate();
              }
            }, true);

            scope.$watch('event.durationminutes', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                updateEndDate();
              }
            }, true);

          }
        };
      }
    };

  });
