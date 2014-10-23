'use strict';

angular.module('anorakApp')
  .controller('PromotionIndexCtrl', function ($scope, promotionUserList) {
    $scope.getPagePartial = function () {
      return 'views/admin/promotion/index.html';
    };

    $scope.promotionUserList = promotionUserList;



  });
