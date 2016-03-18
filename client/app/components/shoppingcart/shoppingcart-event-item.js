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
        return vm.item.groupMinPersons + vm.item.groupEventAdditionalPersons;
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
