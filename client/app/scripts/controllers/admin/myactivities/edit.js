'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditCtrl', function ($scope, activity) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/edit.html';
    };

    $scope.activity = activity;



  });
