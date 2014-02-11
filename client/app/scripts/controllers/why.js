'use strict';

angular.module('anorakApp')
  .controller('WhyCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/why.html';
    };

  });
