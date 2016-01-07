'use strict';

angular.module('anorakApp')
  .directive('item', function (APP_CONFIG, $location) {
    return {
      templateUrl: 'views/directives/item.html',
      restrict: 'E',
      scope: {
        activity: '=',
        bookableItem: '=',
        event: '='
      },
      controller: function ($scope, shoppingcart) {
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
            image: $scope.activity.images[0],
            availableQuantity: $scope.event.availableQuantity,
            groupEvent: $scope.event.groupEvent,
            groupMinPersons: $scope.event.groupMinPersons,
            groupMaxPersons: $scope.event.groupMaxPersons,
            priceForGroupEvent: $scope.event.priceForGroupEvent,
            priceForAdditionalPerson: $scope.event.priceForAdditionalPerson
          });

          if (APP_CONFIG.mobile) {
            $location.path("/payment/");
          }

        };

      }
    };
  });
