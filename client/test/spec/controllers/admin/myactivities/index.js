'use strict';

describe('Controller: AdminMyactivitiesIndexCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AdminMyactivitiesIndexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMyactivitiesIndexCtrl = $controller('AdminMyactivitiesIndexCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
