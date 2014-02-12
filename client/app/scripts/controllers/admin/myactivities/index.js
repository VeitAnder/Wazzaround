'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesIndexCtrl', function ($scope, myActivitiesList, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/index.html';
    };

    $scope.activities = myActivitiesList;

    $scope.open = function (activity) {
      console.log(activity._id);
      $location.path("/admin/myactivities/" + activity._id + "/");
    };

  });
