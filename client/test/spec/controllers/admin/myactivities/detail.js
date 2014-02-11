'use strict';

describe('Controller: AdminMyactivitiesDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AdminMyactivitiesDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMyactivitiesDetailCtrl = $controller('AdminMyactivitiesDetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
