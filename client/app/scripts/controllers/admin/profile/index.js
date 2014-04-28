'use strict';

angular.module('anorakApp')
  .controller('AdminProfilePageCtrl', function ($scope, currentUser, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/profile/index.html';
    };

    $scope.userprofile = currentUser.user.profile;
    $scope.user = currentUser.user;

    $scope.edit = function () {
      $location.path("/admin/profile/edit");
    };

  })
  .controller('AdminProfileEditCtrl', function ($scope, currentUser, models, $location) {

    $scope.getPagePartial = function () {
      return 'views/admin/profile/edit.html';
    };

    $scope.userprofile = currentUser.user.profile;

    $scope.saveUserProfile = function () {

      $scope.state.submitted = true;

      if ($scope.valForm.$valid) {

        models.UserModel.saveUserProfile(currentUser.user)   // TODO we are lacking a method to save user profile only
          .then(function () {
            $location.path("/admin/profile");  // TODO message das speichern erfolgreich
          })
          .fail(function (err) {       // TODO fail message
            debug("Could not save user profile");
          });
      }
    };

//    $scope.cancel = function() {
//      $location.path = "/admin/profile";
//    };

  });
