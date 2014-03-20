'use strict';

angular.module('anorakApp')
  .controller('LoginCtrl', function ($scope, $routeParams, $location, currentUser) {
    $scope.getPagePartial = function () {
      return 'login.html';
    };

    $scope.form = {};
    $scope.state = {};

    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.login = function () {
      var password = CryptoJS.SHA256($scope.form.password).toString(CryptoJS.enc.Base64);
      currentUser.login($scope.form.email, password)
        .then(function () {
          // http://stackoverflow.com/questions/19499323/location-path-doesnt-change-in-a-factory-with-angularjs
          $scope.$apply(function () {
            $location.path('/admin/');
          });
        })
        .fail(function (err) {
          $scope.state.error = true;
          $scope.state.message = err.message;
          $scope.$apply();
        });
    };

    $scope.forgotPassword = function () {
      $location.path('/registration/forgotpassword/');
    };

  });