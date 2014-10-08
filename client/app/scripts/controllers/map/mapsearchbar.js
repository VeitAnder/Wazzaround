'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, $filter, frontendmap) {

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

    $scope.calDaysOptions = $scope.frontendmap.calDaysOptions;

    $scope.calDaysOptionsSelected = $scope.frontendmap.calDaysOptionsSelected;


    $scope.$watch('calDaysOptionsSelected', function () {
      $scope.frontendmap.map.searchEndDate = moment(frontendmap.map.searchStartDate)
        .add($scope.calDaysOptionsSelected.selection, 'days').toDate();
    }, true);

    $scope.$watch('frontendmap.map.searchStartDate', function () {
      $scope.frontendmap.map.searchEndDate = moment(frontendmap.map.searchStartDate)
        .add($scope.calDaysOptionsSelected.selection, 'days').toDate();
    }, true);

  });
