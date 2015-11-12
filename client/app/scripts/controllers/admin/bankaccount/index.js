'use strict';

angular.module('anorakApp')
  .controller('AdminBankAccountPageCtrl', function ($scope, currentUser, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/bankaccount/index.html';
    };

    $scope.user = currentUser.user;

    $scope.edit = function () {
      $location.path("/admin/bankaccount/edit");
    };

  })
  .controller('AdminBankAccountEditPageCtrl', function ($scope, userResolve) {
    $scope.getPagePartial = function () {
      return 'views/admin/bankaccount/edit.html';
    };

    $scope.user = userResolve;
  })
  .controller('AdminBankAccountEditCtrl', function ($scope, models, $location, $timeout) {
    var returnPath = $location.path().split("edit")[0];

    $scope.state = {
      submitted: false
    };

    $scope.save = function () {
      $scope.state.submitted = true;
      if (!$scope.isEntireFormValid()) {
        return;
      }
      $scope.user.save()
        .then(function () {
          $timeout(function () {
            $location.path(returnPath);
          });
        })
        .fail(function (err) {
          debug("Could not save user profile", err);
          $scope.state.savesuccess = false;
        });
    };

    $scope.cancel = function () {
      $timeout(function () {
        $location.path(returnPath);
      });
    };

    $scope.isEntireFormValid = function () {
      return $scope.valForm.$valid;
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
