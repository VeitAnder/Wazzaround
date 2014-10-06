'use strict';

angular.module('anorakApp')
  .controller('AdminAllactivitiesCtrl', function ($scope, $location, activities, adminActivityFilterAllActivities) {
    $scope.getPagePartial = function () {
      return 'views/admin/allactivities.html';
    };

    $scope.activities = activities;

    $scope.adminActivityFilter = adminActivityFilterAllActivities;

  });
