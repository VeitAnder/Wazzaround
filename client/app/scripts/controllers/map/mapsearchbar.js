'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, frontendmap, Usersessionstates) {

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

    $scope.$watch('search.startDate', function (newStartDate, oldStartDate) {
      debug("STARTDATE CHANGED", newStartDate, oldStartDate);
      if (newStartDate !== oldStartDate) {
        Usersessionstates.states.startdate = newStartDate;
        Usersessionstates.updateSession();
      }
    });

    $scope.$watch('search.endDate', function (newEndDate, oldEndDate) {
      debug("STARTDATE CHANGED", newEndDate, oldEndDate);
      if (newEndDate !== oldEndDate) {
        Usersessionstates.states.endDate = newEndDate;
        Usersessionstates.updateSession();
      }
    });

  })
;
