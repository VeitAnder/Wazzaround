'use strict';

angular.module('anorakApp')
  .controller('RegistrationPageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/registration/index.html';
    };
  })
  .controller('RegisterCtrl', function ($scope, $routeParams, $location, currentUser, models, $timeout) {
    // redirect to amin interface if user is logged in
    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.registrant = {};

    $scope.state = {
      submitted: false,
      registrationfailed: false,
      registrationsuccess: false,
      errormessage: ""
    };

    $scope.register = function () {
      var user;
      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {
        user = angular.copy($scope.registrant);
        user.password = CryptoJS.SHA256($scope.registrant.password).toString(CryptoJS.enc.Base64);
        models.UserModel.register(user)
          .then(function () {
            $timeout(function () {
              $scope.state.registrationsuccess = true;
              $scope.state.errormessage = "";
            });
          })
          .fail(function (err) {
            $timeout(function () {
              $scope.state.registrationfailed = true;
              $scope.state.errormessage = err.message;
            });
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
      var formName = "valForm";
      var showerror = false;
      if ($scope[formName][fieldName].$error[error] && (!$scope[formName][fieldName].$pristine || $scope.state.submitted)) {
        showerror = true;
      }
      return showerror;
    };

  }
);