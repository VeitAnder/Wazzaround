'use strict';

describe('Controller: WorkwithusCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var WorkwithusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorkwithusCtrl = $controller('WorkwithusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
