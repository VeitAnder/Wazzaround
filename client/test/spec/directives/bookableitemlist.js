'use strict';

describe('Directive: bookableitemlist', function () {

  // load the directive's module
  beforeEach(module('anorakApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bookableitemlist></bookableitemlist>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bookableitemlist directive');
  }));
});
