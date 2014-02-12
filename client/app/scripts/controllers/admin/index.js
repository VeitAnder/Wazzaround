'use strict';

angular.module('anorakApp')
  .controller('AdminIndexCtrl', function ($scope, $location) {
    $scope.getPagePartial = function () {
      return 'admin/index.html';
    };

    $location.path("/admin/myactivities/");

  });
