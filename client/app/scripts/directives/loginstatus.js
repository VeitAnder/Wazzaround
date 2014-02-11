'use strict';

angular.module('anorakApp')
  .directive('loginstatus', function (currentUser, $location) {
    return {
      templateUrl: 'directives/loginstatus.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.currentUser = currentUser;

        scope.logout = function () {
          currentUser.logout();
          // @TODO logout() not then-able
          $location.path("/");
        };

      }
    };
  });
