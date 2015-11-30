'use strict';

angular.module('anorakApp')
  .directive('eventPricing', function eventPricing() {

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
      templateUrl: 'views/directives/event-pricing.html'
    };
    return directiveDefinitionObject;

  });
