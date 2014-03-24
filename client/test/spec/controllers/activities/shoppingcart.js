'use strict';

describe('Controller: ActivitiesShoppingcartCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var ActivitiesShoppingcartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivitiesShoppingcartCtrl = $controller('ActivitiesShoppingcartCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
