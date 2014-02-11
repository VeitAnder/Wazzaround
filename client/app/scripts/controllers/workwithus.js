'use strict';

angular.module('anorakApp')
  .controller('WorkwithusCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/workwithus.html';
    };
  });
