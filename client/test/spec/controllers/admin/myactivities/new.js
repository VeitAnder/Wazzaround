'use strict';

describe('Controller: AdminMyactivitiesNewCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AdminMyactivitiesNewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMyactivitiesNewCtrl = $controller('AdminMyactivitiesNewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
