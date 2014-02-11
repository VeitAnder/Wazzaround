'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesIndexCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/index.html';
    };

  });
