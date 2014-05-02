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

  .controller('AdminProfileEditCtrl', function ($scope, currentUser, models, $location, $timeout) {

    $scope.getPagePartial = function () {
      return 'views/admin/profile/edit.html';
    };

    $scope.user = currentUser.user;
    $scope.state = {};

    $scope.saveUserProfile = function () {

      if ($scope.valForm.$valid) {
        $scope.user.save()
          .then(function (asdf) {
            debug("Saved user", asdf);
            $timeout(function () {
              $location.path("/admin/profile");
            });
          })
          .fail(function (err) {
            debug("Could not save user profile", err);
            $scope.state.savesuccess = false;
          });

      }
    };

  });
