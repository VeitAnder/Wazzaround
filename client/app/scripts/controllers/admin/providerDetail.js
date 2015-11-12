'use strict';

angular.module('anorakApp')
  .controller('ProviderDetailCtrl', function ($scope, provider, activities, $timeout, $route, $location, currentUser) {
    $scope.getPagePartial = function () {
      return 'views/admin/providerDetail.html';
    };

    $scope.provider = provider;
    $scope.user = provider;
    $scope.activities = activities;

    $scope.currentUser = currentUser;

    $scope.editProfile = function () {
      $timeout(function () {
        $location.path("/admin/providers/" + provider._id + "/edit/");
      });
    };

  });
