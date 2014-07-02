'use strict';

describe('Controller: AffiliateagreementCtrl', function () {

  // load the controller's module
  beforeEach(module('anorakApp'));

  var AffiliateagreementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AffiliateagreementCtrl = $controller('AffiliateagreementCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
