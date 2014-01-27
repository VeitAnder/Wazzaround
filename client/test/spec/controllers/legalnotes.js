'use strict';

describe('Controller: LegalnotesCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var LegalnotesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LegalnotesCtrl = $controller('LegalnotesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
