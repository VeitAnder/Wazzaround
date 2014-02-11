'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesNewCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/new.html';
    };

  });
