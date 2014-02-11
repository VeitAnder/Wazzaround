'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/detail.html';
    };

  });
