'use strict';

angular.module('anorakApp')
  .directive('shoppingcartEventItem', function (shoppingcart, translationutils) {

    var controller = function () {
      var vm = this;

      vm.shoppingcart = shoppingcart;
      vm.translationutils = translationutils;

      //implementations
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
      templateUrl: 'views/directives/shoppingcart/shoppingcart-event-item.html'
    };
    return directiveDefinitionObject;

  });
