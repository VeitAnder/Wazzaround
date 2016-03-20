'use strict';

angular.module('anorakApp')
  .directive('eventPricingEdit', function eventPricingEditDirective() {

    var controller = ['$scope', function ($scope) {
      var vm = this;

      // auto set quantity to 1 when group Event is activated
      $scope.$watch(
        function () {
          return vm.event.groupEvent;
        },
        function (newVal, oldVal) {
          if (newVal !== oldVal) {
            if (newVal === true) {
              vm.event.quantity = 1;
            }
          }
        }
      );
    }];

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        event: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'components/event/event-pricing-edit.html'
    };
    return directiveDefinitionObject;

  });
