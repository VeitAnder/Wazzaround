'use strict';

angular.module('anorakApp')

  .controller('RegistrationRegistrationforprovidersPageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/registration/registrationforproviders.html';
    };
  })
  .controller('RegistrationRegistrationforprovidersCtrl', function ($scope, $routeParams, $location, models, currentUser, Countrylist) {
    // don't initalize registrant here - overrides all data when changing language !!
    // @TODO write test case for this
    // $scope.registrant = {};

    $scope.state = {
      submitted: false,
      registrationfailed: false
    };

    // redirect to amin interface if user is logged in
    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.register = function () {
      var user;

      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {

        // TODO remove monkey patch to prefill fax and uid
        if (!$scope.registrant.profile.fax) {
          $scope.registrant.profile.fax = " ";
        }

        if (!$scope.registrant.profile.uid) {
          $scope.registrant.profile.uid = " ";
        }
        // end monkey patch

        user = angular.copy($scope.registrant);
        user.password = CryptoJS.SHA256($scope.registrant.password).toString(CryptoJS.enc.Base64);
        user.userType = "provider";
        models.UserModel.register(user)
          .then(function () {
            return currentUser.login(user.email, user.password);
          })
          .then(function () {
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

    $scope.Countrylist = Countrylist;

  });
