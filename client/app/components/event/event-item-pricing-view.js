'use strict';

angular.module('anorakApp')
  .directive('eventItemPricingView', function eventItemPricingViewDirective() {

    var controller = function () {
      var vm = this;
    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        event: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'components/event/event-item-pricing-view.html'
    };
    return directiveDefinitionObject;

  });
