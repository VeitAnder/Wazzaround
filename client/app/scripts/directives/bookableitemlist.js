'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function ($timeout) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        activity: '=activity'
      },
      link: function postLink(scope, elem, attrs) {
        if (!attrs.itemsperpage) {
          scope.itemsperpage = scope.activity.bookableItems.length;
        } else {
          scope.itemsperpage = attrs.itemsperpage;
        }
      }
    };
  });
