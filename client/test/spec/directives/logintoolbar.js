'use strict';

describe('Directive: loginToolbar', function () {

  // load the directive's module
  beforeEach(module('login'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<login-toolbar></login-toolbar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loginToolbar directive');
  }));
});
