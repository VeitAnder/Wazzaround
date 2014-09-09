'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, frontendmap) {

    $scope.frontendmap = frontendmap;

    $scope.search = {
      minDate: moment().subtract(1, 'days').toDate(),
      maxDate: moment(frontendmap.map.searchStartDate).add(18, 'months').toDate(),
      fromDate: new Date()
    };

    $scope.searchActivities = function () {
      frontendmap.onSearchAddressChange();
    };

    $scope.$watch('frontendmap.map.searchStartDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        frontendmap.onSearchDateChange();
      }
    }, true);

    $scope.$watch('frontendmap.map.searchEndDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        frontendmap.onSearchDateChange();
      }
    }, true);

    $scope.getGoogleAddressAutoCompletionList = function (viewValue) {
      return frontendmap.getGoogleAddressAutoCompletionList(viewValue);
    };
  });
