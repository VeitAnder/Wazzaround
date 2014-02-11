'use strict';

describe('Controller: AdminMyactivitiesEditCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AdminMyactivitiesEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMyactivitiesEditCtrl = $controller('AdminMyactivitiesEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
