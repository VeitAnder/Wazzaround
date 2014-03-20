angular.module('anorakApp')
  .controller('ForgotPasswordPageCtrl', function ($scope, $route, $location) {
    'use strict';
    var pagetemplate = 'registration/forgotpassword/index.html';

    if ($route.current.params.email && $route.current.params.token) {
      pagetemplate = 'registration/forgotpassword/setpassword.html';
    }

    $scope.getPagePartial = function () {
      return pagetemplate;
    };
  })

  .controller('ForgotPasswordCtrl', function ($scope, $location, $http, APP_CONFIG, $window, models, $route) {
    'use strict';

    $scope.user = {};
    $scope.status = {
      submitted: false,
      passwordrequestsuccess: false,
      error: null
    };

    $scope.requestPasswordReset = function () {
      $scope.status.submitted = true;
      $scope.status.error = null;

      if ($scope.valForm.$valid) {
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

      }
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    $scope.showError = function (fieldName, error) {
      var formName = "valForm";
      var showerror = false;
      if ($scope[formName][fieldName].$error[error] && (!$scope[formName][fieldName].$pristine || $scope.status.submitted)) {
        showerror = true;
      }
      return showerror;
    };

    $scope.canSave = function () {
      return $scope.valForm.$valid;
    };

  })
  .controller('ForgotPasswordSetPasswordCtrl', function ($scope, $location, $http, APP_CONFIG, $window, models, $route) {
    'use strict';

    $scope.userdata = {
      password: "",
      passwordrepeat: ""
    };

    $scope.status = {
      submitted: false,
      setnewpasswordsuccess: null
    };

    // TODO evaluate while typing whether passwords are the same
    $scope.setNewPassword = function () {
      $scope.status.submitted = true;

      console.log("$route", $route);
      if ($scope.valForm.$valid) {

        var password = CryptoJS.SHA256($scope.userdata.password).toString(CryptoJS.enc.Base64);
        models.AccesstokenModel.setNewPassword({
          "email": $route.current.params.email,
          "token": $route.current.params.token,
          "password": password
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
      }
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    $scope.showError = function (fieldName, error) {
      var formName = "valForm";
      var showerror = false;
      if ($scope[formName][fieldName].$error[error] && (!$scope[formName][fieldName].$pristine || $scope.status.submitted)) {
        showerror = true;
      }
      return showerror;
    };

  });
