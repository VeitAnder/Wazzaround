'use strict';

describe('Directive: shoppingcart', function () {

  // load the directive's module
  beforeEach(module('anorakApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<shoppingcart></shoppingcart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the shoppingcart directive');
  }));
});
