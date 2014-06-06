'use strict';

angular.module('anorakApp')
  .directive('activitybardetail', function (models) {
    return {
      restrict: 'E',
      templateUrl: 'views/directives/activitybardetail.html'
    };
  });
