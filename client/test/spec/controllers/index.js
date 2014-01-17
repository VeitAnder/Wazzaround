'use strict';

describe('Controller: indexCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var indexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    indexCtrl = $controller('indexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
