'use strict';

angular.module('anorakApp')
  .directive('activityList', function activityListFactory() {

    var controller = function () {

    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        activities: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'views/directives/activitylist.html'
    };
    return directiveDefinitionObject;
  }
);
