'use strict';

angular.module('anorakApp')
  .controller('LegalnotesCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'legalnotes.html';
    };
  });
