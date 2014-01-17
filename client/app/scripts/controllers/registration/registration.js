angular.module('registration', ['services.authentication', 'services.localizedMessages'])
  .config(function ($routeProvider) {
    'use strict';
    $routeProvider.when('/registration/', {
      templateUrl: 'registration/registration_page.tpl.html',
      controller: 'RegistrationPageCtrl'
    });
  })
  .controller('RegistrationPageCtrl', function ($scope, $location, $http, UserRegistrations, $window) {
    'use strict';
    $scope.user = {};

    $scope.submitted = {
      "it": false
    };

    $scope.send = function () {
      var newuser;
      $scope.submitted.it = true;
      if ($scope.valForm.$valid) {
        newuser = new UserRegistrations();
        angular.extend(newuser, $scope.user);
        newuser.$save().then(function () {
          $scope.onsuccessfullregistration = true;
        }, function () {
          $scope.onfailedregistration = true;
        });
      }
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */

    $scope.showError = function (fieldName, error) {
      var showerror = false;
      if ($scope.valForm[fieldName].$error[error] && (!$scope.valForm[fieldName].$pristine || $scope.submitted.it)) {
        showerror = true;
      }
      return showerror;
    };

    $scope.gotoLogin = function () {
      // force reload for browser autofill
      if ($scope.user.email) {
        $window.location = '/#/login/' + $scope.user.email + '/';
      } else {
        $window.location = '/#/login/';
      }
    };

    $scope.cancel = function () {
      $window.location = '/#/login/';
    };

  });
