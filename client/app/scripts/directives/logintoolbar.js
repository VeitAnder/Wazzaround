'use strict';
angular.module('login')
  .directive('loginToolbar', function (currentUser, AuthenticationService, $location) {
    return {
      templateUrl: 'login/toolbar.tpl.html',
      restrict: 'A',
      replace: true,
      scope: true,
      link: function ($scope, $element, $attrs) {
        $scope.userInfo = currentUser.info;
        $scope.isAuthenticated = currentUser.isAuthenticated;
        $scope.logout = function () {
          AuthenticationService.logout();
        };
        $scope.login = function () {
          AuthenticationService.showLogin();
        };

        $scope.gotoAccountPage = function () {
          $location.path("/#/account");
        };

      }
    };
  });


