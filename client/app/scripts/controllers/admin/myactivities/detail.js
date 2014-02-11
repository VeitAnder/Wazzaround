'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope, $location, activity) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/detail.html';
    };

    $scope.activity = activity;

    $scope.delete = function (activity) {
      activity.remove()
        .then(function () {
          console.log("deleted activity", activity);
          $location.path("/admin/myactivities/");
          $scope.$apply();
        });
    };

  });
