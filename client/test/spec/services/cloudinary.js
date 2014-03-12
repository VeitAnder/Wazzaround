'use strict';

describe('Service: Cloudinary', function () {

  // load the service's module
  beforeEach(module('anorakApp'));

  // instantiate service
  var Cloudinary;
  beforeEach(inject(function (_Cloudinary_) {
    Cloudinary = _Cloudinary_;
  }));

  it('should do something', function () {
    expect(!!Cloudinary).toBe(true);
  });

});
