'use strict';

angular.module('anorakApp')
  .controller('LogoCtrl', function ($scope, $location) {
    $scope.goToHome = function () {
      $location.$path = "/";
    };
  });
