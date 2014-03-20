'use strict';

angular.module('anorakApp')
  .controller('RegistrationPageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'registration/index.html';
    };
  })
  .controller('RegisterCtrl', function ($scope, $routeParams, $location, currentUser) {
    $scope.registrant = {
    };
    $scope.state = {
      submitted: false,
      registrationfailed: false
    };

    // redirect to amin interface if user is logged in
    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.register = function () {
      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {
        var password = CryptoJS.SHA256($scope.registrant.password).toString(CryptoJS.enc.Base64);
        currentUser.register($scope.registrant.email, password)
          .then(function () {
            // http://stackoverflow.com/questions/19499323/location-path-doesnt-change-in-a-factory-with-angularjs
            $scope.$apply(function () {
              $location.path('/admin/');
            });
          })
          .fail(function (err) {
            $scope.state.registrationfailed = true;
            $scope.state.errormessage = err.message;
            $scope.$apply();
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

  });