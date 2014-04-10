'use strict';

describe('Service: Usersessionstates', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var Usersessionstates;
  beforeEach(inject(function (_Usersessionstates_) {
    Usersessionstates = _Usersessionstates_;
  }));

  it('should do something', function () {
    expect(!!Usersessionstates).toBe(true);
  });

});
