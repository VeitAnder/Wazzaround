'use strict';

angular.module('anorakApp')
    .directive('allActivitiesList', function () {
      return {
        templateUrl: 'views/directives/allActivitiesList.html',
        restrict: 'E',
        controller: function ($scope, $location) {

          $scope.open = function (activity) {
            $location.path("/admin/allactivities/" + activity._id + "/");
          };

          $scope.toggle = function($event, activity) {
            $event.stopPropagation();

            activity.published = !activity.published;
            activity.unreviewedChanges = 0;

            activity.save().done();
          };

          $scope.verify = function($event, activity) {
            $event.stopPropagation();
            activity.published = true;
            activity.unreviewedChanges = 0;

            activity.save().done();
          };

          $scope.remove = function($event, activity) {
            $event.stopPropagation();
            activity.published = false;
            activity.unreviewedChanges = 0;

            activity.save().done();
          };

        }
      };
    });