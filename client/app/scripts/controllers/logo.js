'use strict';

angular.module('anorakApp')
  .controller('LogoCtrl', function ($scope, $window) {
    $scope.goToHome = function () {
      $window.location = "/";
    };
  });
