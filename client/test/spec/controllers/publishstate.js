'use strict';

describe('Controller: PublishstatectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var PublishstatectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PublishstatectrlCtrl = $controller('PublishstatectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
