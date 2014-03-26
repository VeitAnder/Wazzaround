'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function () {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        bookableitems: '=bookableitems'
      },
      link: function postLink(scope, elem, attrs) {
        if (!attrs.itemsperpage) {
          scope.itemsperpage = scope.bookableitems.length;
        } else {
          scope.itemsperpage = attrs.itemsperpage;
        }
      }
    };
  });
