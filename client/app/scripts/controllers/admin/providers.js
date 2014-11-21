'use strict';

angular.module('anorakApp')
  .controller('ProvidersCtrl', function ($scope, providers, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/providers.html';
    };

    $scope.providers = providers;

    $scope.handleItemClick = function (item) {
      $location.path("/admin/providers/" + item._id + "/");
    };
  });
