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
  //    controllerAs : 'item',
      controller : function($scope, shoppingcart) {

        $scope.addToShoppingCart = function (event, bookableItem, activity) {
          shoppingcart.add({
              eventId: event._id,
              bookableItemId: bookableItem._id,
              activityId: activity._id,
              description: bookableItem.description,
              price: event.price,
              quantity: 1,
              start: event.start,
              end: event.end,
              category: activity.category.main,
              image: activity.images[0]
            });
        };

      }
    };
  });
