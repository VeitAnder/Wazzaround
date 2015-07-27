'use strict';

angular.module('anorakApp')
  .directive('activityList', function activityListFactory(translationutils, $location) {

    var controller = function () {
      this.translationutils = translationutils;

      this.goToDetailPage = function (activity) {
        $location.path('/activities/' + activity._id + '/');
      };

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
