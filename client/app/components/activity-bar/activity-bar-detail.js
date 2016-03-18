angular
  .module('anorakApp')
  .directive('activityBarDetail', function (translationutils) {
      var controller = function () {
        var vm = this;
        vm.translationutils = translationutils;
      };

      var directiveDefinitionObject = {
        restrict: 'E',
        scope: {
          activity: "=",
          activitydetailactive: "="
        },
        controller: controller,
        controllerAs: '$ctrl',
        bindToController: true, //required in 1.3+ with controllerAs
        templateUrl: 'components/activity-bar/activity-bar-detail.html'
      };
      return directiveDefinitionObject;
    }
  );
