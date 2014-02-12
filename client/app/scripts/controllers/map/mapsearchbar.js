'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, mapdataservice) {

    $scope.search = {
      minDate: new Date(),
      fromDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      address: ""
    };

    $scope.datepicker = { date : new Date() };

    $scope.searchActivities = function () {
      console.log("SEARCH", $scope.startDate, $scope.endDate, $scope.address);

      if ($scope.search.address.length > 0) {
        mapdataservice.setAddress($scope.search.address).then(function () {
        });
      }
    }

    $scope.$watch('datepicker.date', function(oldV, newV) {
      console.log("CHANGED DATEPICKER DATE", newV);
    });

    $scope.$watch('search.startDate', function(oldV, newV) {
      console.log("CHANGED DATEPICKER DATE", newV);
    });

  });
