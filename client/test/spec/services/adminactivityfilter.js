'use strict';

describe('Service: adminActivityFilter', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var adminActivityFilter;
  beforeEach(inject(function (_adminActivityFilter_) {
    adminActivityFilter = _adminActivityFilter_;
  }));

  it('should do something', function () {
    expect(!!adminActivityFilter).toBe(true);
  });

});
