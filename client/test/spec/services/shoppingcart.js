'use strict';

describe('Service: Shoppingcart', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var Shoppingcart;
  beforeEach(inject(function (_Shoppingcart_) {
    Shoppingcart = _Shoppingcart_;
  }));

  it('should do something', function () {
    expect(!!Shoppingcart).toBe(true);
  });

});
