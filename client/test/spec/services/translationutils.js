'use strict';

describe('Service: Translationutils', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var Translationutils;
  beforeEach(inject(function (_Translationutils_) {
    Translationutils = _Translationutils_;
  }));

  it('should do something', function () {
    expect(!!Translationutils).toBe(true);
  });

});
