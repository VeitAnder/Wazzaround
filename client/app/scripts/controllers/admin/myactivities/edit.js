'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/edit.html';
    };

  });
