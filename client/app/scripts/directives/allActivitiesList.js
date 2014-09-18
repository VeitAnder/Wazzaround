'use strict';

angular.module('anorakApp')
  .directive('allActivitiesList', function () {
    return {
      templateUrl: 'views/directives/allActivitiesList.html',
      restrict: 'E',
      controllerAs: "publishstateCtrl",
      controller: 'PublishstateCtrl'
    };
  });