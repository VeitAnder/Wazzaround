'use strict';

angular.module('anorakApp')
  .controller('WhyCtrl', function ($scope, $translate) {
    $scope.getPagePartial = function () {
      return 'views/why.html';
    };

    $scope.lang = $translate.use();
    $scope.$watch(function () {
      return $translate.use();
    }, function () {
      $scope.lang = $translate.use();
    });

  });
