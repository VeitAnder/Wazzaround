'use strict';

angular.module('anorakApp')
  .controller('WorkwithusPageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/workwithus.html';
    };
  })
  .controller('WorkwithusCtrl', function ($scope, $translate) {
    $scope.lang = $translate.use();
    $scope.$watch(function () {
      return $translate.use();
    }, function () {
      $scope.lang = $translate.use();
    })
  });
