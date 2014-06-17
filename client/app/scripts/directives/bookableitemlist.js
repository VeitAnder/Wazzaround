'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart, $timeout) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=',
        filter: '=',
        limit: '='
      },
      controller: function ($scope) {

        var isItemEnabled = function (item) {
          if (!$scope.filter) return true;  // nicht filtern, wenn kein filter definiert ist

          return item.filter.enabled();
        };

        var isEventEnabled = function (event) {
          if (!$scope.filter) return true;  // nicht filtern, wenn kein filter definiert ist

          if (event.start < $scope.filter.from) return false;
          if (event.start > $scope.filter.until) return false;
          return true;
        };

        $scope.getSortedEvents = function () {
          // erst mal filtern
          var sortedEvents = [];

          _.forEach($scope.activity.bookableItems, function (bookableItem) {
            if (isItemEnabled(bookableItem)) {
              _.forEach(bookableItem.events, function (event) {
                if (isEventEnabled(event)) {
                  sortedEvents.push({
                    date: event.start,
                    activity: $scope.activity,
                    bookableItem: bookableItem,
                    event: event
                  });
                }
              });
            }
          });

          // dann nach datum sortieren
          sortedEvents = _.sortBy(sortedEvents, 'date');

          return sortedEvents;
        }
      }
    };
  });
