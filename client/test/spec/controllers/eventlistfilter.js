'use strict';

describe('Controller: EventlistfilterCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var EventlistfilterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventlistfilterCtrl = $controller('EventlistfilterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
