'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=activity'
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, element, attrs, controller) {
            scope.addToShoppingCart = function (event, bookableItem, activity) {
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
          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };

      }
    };
  });
