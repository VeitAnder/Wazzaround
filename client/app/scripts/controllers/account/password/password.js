angular.module('anorakApp')
  .controller('PasswordCtrl', function ($scope, $location, Users, currentUser) {
    'use strict';

    $scope.gotoAccountPage = function () {
      $location.path("/account");
    };

    $scope.state = {
      requestInProgress: false,
      onsuccess: false,
      onfail: false
    };

    $scope.save = function () {
      $scope.state.requestInProgress = true;
      Users.getById(currentUser.info().id)
        .then(function (user) {
          return user.setPassword($scope.password);
        })
        .then(function (user) {
          $scope.state.onsuccess = true;
          $scope.state.requestInProgress = false;
        })
        .catch(function (err) {
          $scope.state.onfail = true;
          $scope.state.requestInProgress = false;
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

  });