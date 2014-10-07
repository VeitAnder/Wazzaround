'use strict';

describe('Service: mediaquery', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var mediaquery;
  beforeEach(inject(function (_mediaquery_) {
    mediaquery = _mediaquery_;
  }));

  it('should do something', function () {
    expect(!!mediaquery).toBe(true);
  });

});
