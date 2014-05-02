'use strict';

describe('Filter: getdistance', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var getdistance;
  beforeEach(inject(function ($filter) {
    getdistance = $filter('getdistance');
  }));

  it('should return the input prefixed with "getdistance filter:"', function () {
    var text = 'angularjs';
    expect(getdistance(text)).toBe('getdistance filter: ' + text);
  });

});
