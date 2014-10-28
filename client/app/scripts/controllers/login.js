'use strict';

angular.module('anorakApp')
  .controller('LoginCtrl', function ($scope, $routeParams, $location, currentUser) {
    $scope.getPagePartial = function () {
      return 'views/login.html';
    };

    $scope.form = {};
    $scope.state = {};

    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.login = function (event) {
      event.preventDefault();

      // dirty hack to grab password and email when autofilled by browser - #28
      // controller should never access DOM
      var password = CryptoJS.SHA256($("#password").val()).toString(CryptoJS.enc.Base64);
      var email = $("#email").val();

      currentUser.login(email, password)
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
