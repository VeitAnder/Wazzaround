'use strict';

angular.module('anorakApp')
  .controller('AdminAllactivitiesCtrl', function ($scope, activities) {
    $scope.getPagePartial = function () {
      return 'admin/allactivities.html';
    };

    $scope.activities = activities;

    $scope.open = function (activity) {
      // todo - brauchts auch für alle
      //$location.path("/admin/myactivities/" + activity._id + "/");
    };

    $scope.toggle = function(activity) {
      activity.published = !activity.published;

      activity.save().done();
    };
  });
