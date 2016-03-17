'use strict';

angular.module('anorakApp')

  .controller('RegistrationRegistrationforprovidersPageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/registration/registrationforproviders.html';
    };
  })
  .controller('RegistrationRegistrationforprovidersCtrl', function ($scope, $routeParams, $location, models, currentUser, Countrylist, $timeout, $translate) {
    // redirect to amin interface if user is logged in
    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.registrant = {
      profile: {
        country: {}
      }
    };

    $scope.state = {
      submitted: false,
      registrationfailed: false,
      registrationsuccess: false
    };

    $scope.register = function () {
      var user;

      $scope.state.submitted = true;

      if ($scope.isEntireFormValid()) {

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
        user.languageKey = $translate.use();
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

    $scope.isEntireFormValid = function () {
      return $scope.valForm.$valid && $scope.isCountryValid();
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

    $scope.isCountryValid = function () {
      return $scope.registrant.profile.country.code;
    };

  });
