'use strict';

angular.module('anorakApp')
  .directive('hoursbookablebeforestart', function hoursbookablebeforestart() {

    var controller = function () {
      var vm = this;

      if (vm.event.bookingEndsHoursBeforeStart === undefined || vm.event.bookingEndsHoursBeforeStart === null) {
        vm.event.bookingEndsHoursBeforeStart = 1;
      }

    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        event: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'views/directives/hoursbookablebeforestart.html'
    };
    return directiveDefinitionObject;

  });
