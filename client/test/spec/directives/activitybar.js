'use strict';

describe('Directive: activitybar', function () {

  // load the directive's module
  beforeEach(module('anorakApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<activitybar></activitybar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the activitybar directive');
  }));
});
