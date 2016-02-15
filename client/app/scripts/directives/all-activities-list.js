'use strict';

angular.module('anorakApp')
  .directive('allActivitiesList', function () {
    return {
      templateUrl: 'views/directives/all-activities-list.html',
      restrict: 'E',
      controllerAs: "publishstateCtrl",
      controller: 'PublishstateCtrl'
    };
  });