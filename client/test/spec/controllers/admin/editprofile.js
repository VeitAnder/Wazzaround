'use strict';

describe('Controller: AdminEditprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AdminEditprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminEditprofileCtrl = $controller('AdminEditprofileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
