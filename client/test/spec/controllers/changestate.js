'use strict';

describe('Controller: ChangestateCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var ChangestateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChangestateCtrl = $controller('ChangestateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
