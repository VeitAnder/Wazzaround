'use strict';

angular.module('anorakApp')
  .directive('eventView', function eventViewDirective() {

    var controller = function () {
      var vm = this;

      vm.startEventEdit = startEventEdit;
      vm.removeEvent = removeEvent;

      // implementation
      function startEventEdit() {
        vm.event.originalState = angular.copy(vm.event);
        vm.event.mode = 'edit';
      }

      function removeEvent(item, event_idx) {
        item.events.splice(event_idx, 1);  // remove from array
      }

    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        event: "=",
        idx: "=",
        bookableItem: "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'components/event/event-view.html'
    };
    return directiveDefinitionObject;

  });
