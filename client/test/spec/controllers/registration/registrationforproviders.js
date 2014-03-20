'use strict';

describe('Controller: RegistrationRegistrationforprovidersCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var RegistrationRegistrationforprovidersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistrationRegistrationforprovidersCtrl = $controller('RegistrationRegistrationforprovidersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
