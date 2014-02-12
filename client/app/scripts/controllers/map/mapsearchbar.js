'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, mapdataservice) {

    $scope.search = {
      minDate: new Date(),
      fromDate: new Date(),
      startDate: undefined,
      endDate: undefined,
      address: undefined
    };

    $scope.searchActivities = function () {
      mapdataservice.searchActivities($scope.search.startDate, $scope.search.endDate, $scope.search.address);
    };

  });
