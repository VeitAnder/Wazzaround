'use strict';

angular.module('anorakApp')
  .controller('WorkwithusCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'workwithus.html';
    };
  });
