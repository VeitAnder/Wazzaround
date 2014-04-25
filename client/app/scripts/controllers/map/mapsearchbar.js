'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, frontendmap) {

    $scope.frontendmap = frontendmap;

    $scope.search = {
      minDate: moment().subtract('days', 1).toDate(),
      maxDate: moment(frontendmap.map.searchStartDate).add('year', 1).toDate(),
      fromDate: new Date()
    };

    $scope.searchActivities = function () {
      frontendmap.onSearchAddressChange();
    };

    $scope.$watch('frontendmap.map.searchStartDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        frontendmap.onSearchDateChange();
      }
    });

    $scope.$watch('frontendmap.map.searchEndDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        frontendmap.onSearchDateChange();
      }
    });

    $scope.getGoogleAddressAutoCompletionList = function (viewValue) {
      return frontendmap.getGoogleAddressAutoCompletionList(viewValue);
    };
  });
