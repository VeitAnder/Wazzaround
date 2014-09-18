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
    $scope.$watch(function () {
      return self.query;
    }, function () {
      $scope.vm.filteredActivities = $filter('filter')($scope.activities, self.query);
    });
  });
