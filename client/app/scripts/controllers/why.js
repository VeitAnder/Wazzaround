'use strict';

angular.module('anorakApp')
  .controller('WhyCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'why.html';
    };

  });
