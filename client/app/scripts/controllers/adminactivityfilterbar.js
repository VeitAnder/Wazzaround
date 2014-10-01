'use strict';

/**
 * @ngdoc function
 * @name anorakApp.controller:AdminactivityfilterbarCtrl
 * @description
 * # AdminactivityfilterbarCtrl
 * Controller of the anorakApp
 */
angular.module('anorakApp')
    .controller('AdminactivityfilterbarCtrl', function ($scope, $filter) {

      var self = this;

      this.query = '';

      this.filters = {'published': false, 'denied': false, 'unreviewedChanges': false};
      this.filtersState = {'published': true, 'denied': true, 'unreviewedChanges': true};

      $scope.$watch(function (scope) {
        return self;

      }, function () {
        var filteredActivities = $scope.activities;

        filteredActivities = $filter('filter')($scope.activities, self.query);

        if (self.filters.published) {
          filteredActivities = $filter('filter')(filteredActivities, {
            published: self.filtersState.published
          });
        }


        if (self.filters.denied) {
          filteredActivities = $filter('filter')(filteredActivities, {
            denied: self.filtersState.denied
          });
        }


        if (self.filters.unreviewedChanges) {
          if (self.filtersState.unreviewedChanges) {
            filteredActivities = $filter('filter')(filteredActivities, {
              unreviewedChanges: '!0'
            });
          } else {
            filteredActivities = $filter('filter')(filteredActivities, {
              unreviewedChanges: 0
            });
          }
        }


        $scope.vm.filteredActivities = filteredActivities;
      }, true);

    });
