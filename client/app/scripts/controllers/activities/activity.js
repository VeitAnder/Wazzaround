'use strict';

angular.module('anorakApp')
  .controller('ActivityPageCtrl', function ($scope, activity) {
    $scope.getPagePartial = function () {
      return 'views/activities/activity.html';
    };
    $scope.data = {
      activity: activity
    };
  })
  .controller('ActivityCtrl', function ($scope) {

  });
