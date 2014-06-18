'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=',
        filter: '=',
        limit: '='
      },
      controller: function ($scope) {

        var isItemEnabled = function (itemIdx) {
          if (!$scope.filter) return true;  // nicht filtern, wenn kein filter definiert ist

          return $scope.filter.bookableItems[itemIdx].enabled();
        };

        var isEventEnabled = function (event) {
          if (!$scope.filter) return true;  // nicht filtern, wenn kein filter definiert ist

          if (event.start < $scope.filter.from) return false;
          if (event.start > $scope.filter.until) return false;
          return true;
        };

        var createSortedEvents = function () {
          // erst mal filtern
          var sortedEvents = [];

          angular.forEach($scope.activity.bookableItems, function (bookableItem, itemIdx) {
            if (isItemEnabled(itemIdx)) {
              angular.forEach(bookableItem.events, function (event) {
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
        };

        $scope.sortedEvents = createSortedEvents();


        $scope.$watch('filter', function(oldValue, newValue) {
          console.log('filter');
          $scope.sortedEvents = createSortedEvents();
        }, true);

      }
    };
  });
