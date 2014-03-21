'use strict';

angular.module('anorakApp')
  .controller('AdminAllactivitiesCtrl', function ($scope, $location, activities) {
    $scope.getPagePartial = function () {
      return 'views/admin/allactivities.html';
    };

    $scope.activities = activities;

    $scope.open = function (activity) {
      $location.path("/admin/allActivities/" + activity._id + "/");
    };

    $scope.toggle = function(activity) {
      activity.published = !activity.published;

      activity.save().done();
    };

  });
