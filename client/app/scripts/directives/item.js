'use strict';

angular.module('anorakApp')
  .directive('item', function () {
    return {
      templateUrl: 'views/directives/item.html',
      restrict: 'E',
      scope : {
        activity : '=',
        bookableItem : '=',
        event : '='
      },
      controller : function($scope, shoppingcart) {
        $scope.addToShoppingCart = function () {
          shoppingcart.add({
              eventId: $scope.event._id,
              bookableItemId: $scope.bookableItem._id,
              activityId: $scope.activity._id,
              description: $scope.bookableItem.description,
              price: $scope.event.price,
              quantity: 1,
              start: $scope.event.start,
              end: $scope.event.end,
              category: $scope.activity.category.main,
              image: $scope.activity.images[0]
            });
        };

      }
    };
  });
