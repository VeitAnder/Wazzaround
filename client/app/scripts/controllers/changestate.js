'use strict';

angular.module('anorakApp')
  .controller('ChangeStateCtrl', function ($scope) {
    assert($scope.activity, "$scope.activity required for ChangeStateCtrl")

    var activity = $scope.activity;

    this.toggle = function ($event) {
      $event.stopPropagation();

      activity.published = !activity.published;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.publish = function ($event) {
      $event.stopPropagation();

      activity.published = true;
      activity.denied = false;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.deny = function ($event) {
      $event.stopPropagation();

      activity.published = false;
      activity.denied = true;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.verify = function ($event) {
      $event.stopPropagation();
      activity.published = true;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    this.remove = function ($event) {
      $event.stopPropagation();
      activity.published = false;
      activity.unreviewedChanges = 0;

      activity.save().done();
    };

    // die verschieden states abbilden
    if (activity.published === false && activity.denied === false ) {
      this.activity = "new";
      this.changes = false;  // hier sollte das egal sein
    } else if (activity.published === true) {
      this.activity = "published";

      if (activity.unreviewedChanges > 0) this.changes = true;
      else this.changes = false;
    } else if (activity.denied === true) {
      this.activity = "denied";

      if (activity.unreviewedChanges > 0) this.changes = true;
      else this.changes = false;
    } else {
      assert(false, "unknown state");
    }


  });
