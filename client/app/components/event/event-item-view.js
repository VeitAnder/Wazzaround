'use strict';

angular.module('anorakApp')
  .directive('eventItemView', function eventItemViewDirective(APP_CONFIG, $location) {
    return {
      templateUrl: 'components/event/event-item-view.html',
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
            priceForAdditionalPerson: $scope.event.priceForAdditionalPerson
          });

          if (APP_CONFIG.mobile) {
            $location.path("/payment/");
          }

        };

      }
    };
  });
