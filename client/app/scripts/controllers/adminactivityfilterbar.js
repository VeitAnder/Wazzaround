'use strict';

/**
 * @ngdoc function
 * @name anorakApp.controller:AdminactivityfilterbarCtrl
 * @description
 * # AdminactivityfilterbarCtrl
 * Controller of the anorakApp
 */
angular.module('anorakApp')
  .controller('AdminactivityfilterbarCtrl', function ($scope, $filter, adminActivityFilterAllActivities, $timeout) {

    var self = this;

    this.adminActivityFilter = adminActivityFilterAllActivities;

    $scope.$watch(function (scope) {
      return self;

    }, function () {
      var filteredActivities = $scope.activities;

      filteredActivities = $filter('filter')(filteredActivities, self.adminActivityFilter.query);

      if (self.adminActivityFilter.publishedState !== "all") {
        if (self.adminActivityFilter.publishedState === "published") {
          filteredActivities = $filter('filter')(filteredActivities, {
            published: true
          });
        }

        if (self.adminActivityFilter.publishedState === "unpublished") {
          filteredActivities = $filter('filter')(filteredActivities, {
            published: false
          });
        }
      }

      if (self.adminActivityFilter.denied) {
        filteredActivities = $filter('filter')(filteredActivities, {
          denied: true
        });
      }

      if (self.adminActivityFilter.unreviewedChanges) {
        filteredActivities = $filter('filter')(filteredActivities, {
          unreviewedChanges: '!0'
        });
      }

      $scope.vm.filteredActivities = filteredActivities;
    }, true);

  });
