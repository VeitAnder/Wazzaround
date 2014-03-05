angular.module('forgotpassword', ['services.authentication', 'services.localizedMessages'])
  .controller('ForgotpasswordPageCtrl', function ($scope, $location, $http, APP_CONFIG, $window, models) {
    'use strict';
    $scope.user = {};
    $scope.status = {};

    $scope.requestPasswordReset = function () {
      models.AccesstokenModel.sendReactivation({ email: $scope.user.email })
        .then(function (status) {
          $scope.status.passwordrequestsuccess = true;
          console.log("Requested pwd reset link", status);
          $scope.$apply();
        })
        .fail(function (err) {
          debug("Error in sending reactivation token to user", err);
          $scope.status.passwordrequestsuccess = false;
          $scope.$apply();
        })
        .done();
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */

    $scope.showError = function (formName, fieldName, error) {
      var showerror = false;
      if ($scope[formName][fieldName].$error[error] && !$scope[formName][fieldName].$pristine) {
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

    $scope.settingnew = {
      password: "",
      passwordrepeat: ""
    };

    // TODO evaluate while typing whether passwords are the same
    $scope.setNewPassword = function () {
      debug("SETTING NEW PWD");
      // TODO passwort Verschlüsselung???
      models.AccesstokenModel.setNewPassword({
        "email": "email", // TODO
        "token": "token", // TODO
        "password": $scope.settingnew.password
      })
        .then(function () {
          debug("Set new password for user", $scope.user.email);
          // TODO redirect to main page? message? login page plus message?
        })
        .done();
    };

  });
