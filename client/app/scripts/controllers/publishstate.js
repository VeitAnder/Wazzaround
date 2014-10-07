'use strict';

/**
 * @ngdoc function
 * @name anorakApp.controller:PublishstatectrlCtrl
 * @description
 * # PublishstatectrlCtrl
 * Controller of the anorakApp
 */
angular.module('anorakApp')
  .controller('PublishstateCtrl', function ($scope, $location, adminActivityFilter) {

    $scope.vm = {
      filteredActivities: []
    };

    this.adminActivityFilter = new adminActivityFilter();

    this.open = function (activity) {
      $location.path("/admin/allactivities/" + activity._id + "/");
    };

    this.toggle = function ($event, activity) {
      $event.stopPropagation();

      activity.published = !activity.published;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.publish = function ($event, activity) {
      $event.stopPropagation();

      activity.published = true;
      activity.denied = false;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.deny = function ($event, activity) {
      $event.stopPropagation();

      activity.published = false;
      activity.denied = true;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.verify = function ($event, activity) {
      $event.stopPropagation();
      activity.published = true;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.remove = function ($event, activity) {
      $event.stopPropagation();
      activity.published = false;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

  });
