'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart, $timeout) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=activity',
        showpagination: '@showpagination',
        eventlimit: '@limit'
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, element, attrs, controller) {

            console.log("scope.limit", scope.limit);

            if (!scope.eventlimit) {
              scope.eventlimit = 10000000000;
            }

            scope.state = {
              limit: scope.eventlimit
            };

            scope.addToShoppingCart = function (event, bookableItem, activity) {
              // $timeout ensures cart update in view
              $timeout(function () {
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
              });
            };

          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };

      }
    };
  });
