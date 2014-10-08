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

  });
