'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, frontendmap) {

    $scope.search = {
      minDate: new Date(),
      fromDate: new Date(),
      startDate: undefined,
      endDate: undefined,
      address: undefined
    };

    $scope.searchActivities = function () {
      frontendmap.searchActivities(frontendmap.map, $scope.search.startDate, $scope.search.endDate, $scope.search.address);
    };

  });
