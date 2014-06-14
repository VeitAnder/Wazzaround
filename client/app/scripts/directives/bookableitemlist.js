'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function (shoppingcart, $timeout) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      controller : function($scope) {

        $scope.isItemEnabled = function(item) {
          return item.filter.enabled();
        };

        $scope.isEventEnabled = function(event) {
          if (event.start < $scope.filter.from) return false;
          if (event.start > $scope.filter.until) return false;
          return true;
        };
      }
    };
  });
