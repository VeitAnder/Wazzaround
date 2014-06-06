'use strict';

describe('Filter: nohtml', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var nohtml;
  beforeEach(inject(function ($filter) {
    nohtml = $filter('nohtml');
  }));

  it('should return the input prefixed with "nohtml filter:"', function () {
    var text = 'angularjs';
    expect(nohtml(text)).toBe('nohtml filter: ' + text);
  });

});
