'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=',
        filter: '='
      },
      controller: function ($scope, $element, $attrs) {

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

        $scope.limit = $attrs.limit;

        $scope.sortedEvents = createSortedEvents();

        $scope.$watch('filter', function (oldValue, newValue) {
          console.log('filter');
          $scope.sortedEvents = createSortedEvents();
        }, true);

        $scope.$watch('activity', function (oldValue, newValue) {
          console.log('activity');
          $scope.sortedEvents = createSortedEvents();
        });

        var dateAt = [];
        $scope.showDate = function (idx, date) {
          dateAt[idx] = moment(date);
          if (idx == 0) return true;

          if (moment(date).diff(dateAt[idx - 1], 'days') >= 1) return true;
          else return false;

        };

//        //TODO: maybe do that on the server
//        // calc available quantity
//        var calcEventsPromises = [];
//        angular.forEach($scope.activity.bookableItems, function (bookableItem, itemIdx) {
//            angular.forEach(bookableItem.events, function (event) {
//              event.availableQuantity = "?";
//
//              calcEventsPromises.push(
//                models.BookedEventModel.bookedQuantity({
//                  event: event._id
//                }).then(function(res) {
//                  event.availableQuantity = event.quantity - res.quantity;
//                })
//              );
//            });
//        });
//
//        Q.all(calcEventsPromises)
//          .then(function() {
//            console.log("Q.all");
//            $scope.$apply();
//          });

      }
    };
  });
