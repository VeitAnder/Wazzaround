'use strict';

describe('Service: Countrylist', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var Countrylist;
  beforeEach(inject(function (_Countrylist_) {
    Countrylist = _Countrylist_;
  }));

  it('should do something', function () {
    expect(!!Countrylist).toBe(true);
  });

});
