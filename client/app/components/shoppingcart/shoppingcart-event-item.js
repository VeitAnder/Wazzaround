'use strict';

angular.module('anorakApp')
  .directive('shoppingcartEventItem', function (shoppingcart, translationutils) {

    var controller = function () {
      var vm = this;

      vm.shoppingcart = shoppingcart;
      vm.translationutils = translationutils;

      vm.getGroupSize = getGroupSize;

      //implementations
      function getGroupSize() {
        if (vm.item.groupEventAdditionalPersons > 0) {
          return vm.item.groupMinPersons + vm.item.groupEventAdditionalPersons;
        } else {
          return vm.item.groupMinPersons;
        }
      }

    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        item: '=',
        confirmationview: '='
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: 'components/shoppingcart/shoppingcart-event-item.html'
    };
    return directiveDefinitionObject;

  });
