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
      controller : function($scope) {
        console.log("scope.limit", $scope.limit);

        if (!$scope.eventlimit) {
          $scope.eventlimit = 10000000000;
        }

        $scope.state = {
          limit: $scope.eventlimit
        };

      }
    };
  });
