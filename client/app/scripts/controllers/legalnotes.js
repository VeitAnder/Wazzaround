'use strict';

angular.module('anorakApp')
  .controller('LegalnotesCtrl', function ($scope, $translate) {
    $scope.getPagePartial = function () {
      return 'views/legalnotes.html';
    };

    $scope.lang = $translate.use();
    $scope.$watch(function () {
      return $translate.use();
    }, function () {
      $scope.lang = $translate.use();
    });

  });
