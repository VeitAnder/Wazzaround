'use strict';

angular.module('anorakApp')
  .controller('AffiliateagreementCtrl', function ($scope, $translate) {
    $scope.getPagePartial = function () {
      return 'views/affiliateagreement.html';
    };

    $scope.lang = $translate.use();
    $scope.$watch(function () {
      return $translate.use();
    }, function () {
      $scope.lang = $translate.use();
    });
  });
