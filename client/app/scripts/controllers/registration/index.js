'use strict';

angular.module('anorakApp')
  .controller('RegisterCtrl', function ($scope, $routeParams, $location, currentUser) {
    $scope.getPagePartial = function () {
      return 'registration/index.html';
    };

    $scope.form = {};
    $scope.state = {};

    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.register = function () {
      debug("register from", $scope.form);
      // check input
      if ($scope.form.password !== $scope.form.password2) {
        $scope.state.error = true;
        $scope.state.message = "The both passwords have to match";
        return;
      }

      currentUser.register($scope.form.email, $scope.form.password)
        .then(function () {
          // http://stackoverflow.com/questions/19499323/location-path-doesnt-change-in-a-factory-with-angularjs
          $scope.$apply(function () {
            $location.path('/admin/');
          });
        })
        .fail(function (err) {
          debug("Could not register user", err);
          $scope.state.error = true;

          if (err.message.indexOf("invalidPwd") !== -1) {
            $scope.state.message = "invalidPwd";
          } else {
            $scope.state.message = err.message;
          }
          $scope.$apply();
        });
    };

  });