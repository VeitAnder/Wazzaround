'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, frontendmap) {

    $scope.frontendmap = frontendmap;

    var searchChangeHandler = function () {
      frontendmap.onSearchChange();
    };

    $scope.search = {
      minDate: moment().subtract('days', 1).toDate(),
      maxDate: moment(frontendmap.map.searchStartDate).add('year', 1).toDate(),
      fromDate: new Date()
    };

    $scope.searchActivities = function () {
      searchChangeHandler();
    };

    $scope.$watch('frontendmap.map.searchStartDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        searchChangeHandler();
      }
    });

    $scope.$watch('frontendmap.map.searchEndDate', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        searchChangeHandler();
      }
    });

    $scope.getGoogleAddressAutoCompletionList = function (viewValue) {
      return frontendmap.getGoogleAddressAutoCompletionList(viewValue);
    };
  });
