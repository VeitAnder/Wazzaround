'use strict';

angular.module('anorakApp')
  .directive('loginstatus', function (currentUser, $location) {
    return {
      templateUrl: 'views/directives/loginstatus.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.currentUser = currentUser;

        scope.logout = function () {
          currentUser.logout()
            .then(function () {
              scope.$apply(function () {
                $location.path('/');
              });
            });
        };
      }
    };
  });
