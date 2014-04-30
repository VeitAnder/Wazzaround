'use strict';

describe('Filter: mtokm', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var mtokm;
  beforeEach(inject(function ($filter) {
    mtokm = $filter('mtokm');
  }));

  it('should return the input prefixed with "mtokm filter:"', function () {
    var text = 'angularjs';
    expect(mtokm(text)).toBe('mtokm filter: ' + text);
  });

});
