angular.module('anorakApp')
  .controller('ForgotPasswordPageCtrl', function ($scope) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'registration/forgotpassword/index.html';
    };

  })
  .controller('ForgotPasswordCtrl', function ($scope, $location, $http, APP_CONFIG, $window, models, $route) {
    'use strict';

    $scope.user = {};
    $scope.status = {
      resetpassword: !$route.current.params.email && !$route.current.params.token ? false : true
    };

    $scope.requestPasswordReset = function () {
      $scope.status.error = "";

      models.AccesstokenModel.sendReactivation({ email: $scope.user.email })
        .then(function (status) {
          $scope.status.passwordrequestsuccess = true;
          console.log("Requested pwd reset link", status);
          $scope.$apply();
        })
        .fail(function (err) {
          debug("Error in sending reactivation token to user", err);
          $scope.status.passwordrequestsuccess = false;

          if (err.message.indexOf("User not found") !== -1) {
            $scope.status.error = "noUser";

          } else {
            $scope.status.error = "error";
          }
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
      $location.path('/login/');
    };

    $scope.cancel = function () {
      $location.path('/login/');
    };

    $scope.settingnew = {
      password: "",
      passwordrepeat: ""
    };

    // TODO evaluate while typing whether passwords are the same
    $scope.setNewPassword = function () {
      debug("SETTING NEW PWD");

      if ($scope.settingnew.passwordrepeat.length === 0 ||
        $scope.settingnew.password.length === 0 ||
        $scope.settingnew.passwordrepeat !== $scope.settingnew.password) {
        debug("SAVE NOT ALLOWED");
        $scope.status.setnewpasswordsuccess = false;
        // one or both passwords are missing
        if (!$scope.settingnew.passwordrepeat || !$scope.settingnew.password) {
          console.log("MISSING");
          $scope.status.savepwderror = "missing";

        } else if ($scope.settingnew.password !== $scope.settingnew.passwordrepeat) {
          console.log("NO MATCH");
          $scope.status.savepwderror = "noMatch";
        }
        return;
      }

      // TODO passwort Verschlüsselung???   später implementieren

      models.AccesstokenModel.setNewPassword({
        "email": $route.current.params.email,
        "token": $route.current.params.token,
        "password": $scope.settingnew.password
      })
        .then(function () {
          debug("Have set new password");
          // TODO redirect to main page? message? login page plus message?
          $scope.status.setnewpasswordsuccess = true;
          $scope.$apply();
        })
        .fail(function (err) {
          debug("Error in setting new password", err);
          $scope.status.setnewpasswordsuccess = false;

          if (err.message.indexOf("invalidPwd") !== -1) {
            $scope.status.savepwderror = "invalidPwd";
          }
          $scope.$apply();
        })
        .done();
    };

  });
