'use strict';

angular.module('anorakApp')
  .filter('adddistancetosearchlocation', function (frontendmap, $filter) {
    return function (activities, config) {
      _.each(activities, function (activity) {
        activity.distancetosearchlocation = $filter('getdistance')({location1: frontendmap.getCurrentSearchLocation(), location2: activity.location});
      });
      return activities;
    };
  });
