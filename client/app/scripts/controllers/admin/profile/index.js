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

  .controller('AdminProfileEditCtrl', function ($scope, currentUser, models, $location) {

    $scope.getPagePartial = function () {
      return 'views/admin/profile/edit.html';
    };

    $scope.user = currentUser.user;

    $scope.saveUserProfile = function () {

//      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {

        $scope.user.save()
          .then(function (asdf) {
            debug("Saved user", asdf);
            $location.path("/admin/profile");  // TODO message das speichern erfolgreich
          })
          .fail(function (err) {       // TODO fail message
            debug("Could not save user profile", err);
            $scope.state.savesuccess = false;
          });

      }
    };

  });
