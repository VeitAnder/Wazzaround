'use strict';

angular.module('anorakApp')
  .controller('AdminProfilePageCtrl', function ($scope, currentUser, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/profile/index.html';
    };

    $scope.user = currentUser.user;

    $scope.edit = function () {
      $location.path("/admin/profile/edit");
    };

  })

  .controller('AdminProfileEditCtrl', function ($scope, currentUser, models, $location, $timeout, Countrylist, $window) {
    var returnPath = $window.location.pathname.split("edit")[0];

    $scope.getPagePartial = function () {
      return 'views/admin/profile/edit.html';
    };

    $scope.user = currentUser.user;

    $scope.state = {
      submitted: false
    };

    $scope.saveUserProfile = function () {
      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {
        $scope.user.save()
          .then(function (asdf) {
            debug("Saved user", asdf);
            $timeout(function () {
              $location.path(returnPath);
            });
          })
          .fail(function (err) {
            debug("Could not save user profile", err);
            $scope.state.savesuccess = false;
          });

      }
    };

    $scope.cancel = function () {
      $timeout(function () {
        $location.path(returnPath);
      });
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
