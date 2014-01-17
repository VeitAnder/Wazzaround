angular.module('forgotpassword', ['services.authentication', 'services.localizedMessages'])
  .config(function ($routeProvider) {
    'use strict';
    $routeProvider.when('/registration/forgotpassword/', {
      templateUrl: 'registration/forgotpassword/forgotpassword_page.tpl.html',
      controller: 'ForgotpasswordPageCtrl'
    });
  })
  .controller('ForgotpasswordPageCtrl', function ($scope, $location, $http, APP_CONFIG, $window) {
    'use strict';
    $scope.user = {};

    $scope.send = function () {
      $http.post(APP_CONFIG.APIUrl + "userregistrations/forgotpassword/", {email: $scope.user.email}).then(function () {
        $scope.passwordrequestsuccess = true;
      }, function () {
        $scope.passwordrequestsuccess = false;
      });
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */

    $scope.showError = function (fieldName, error) {
      var showerror = false;
      if ($scope.valForm[fieldName].$error[error] && !$scope.valForm[fieldName].$pristine) {
        showerror = true;
      }
      return showerror;
    };

    $scope.canSave = function () {
      return $scope.valForm.$valid;
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
