'use strict';

describe('Filter: linebreak', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var linebreak;
  beforeEach(inject(function ($filter) {
    linebreak = $filter('linebreak');
  }));

  it('should return the input prefixed with "linebreak filter:"', function () {
    var text = 'angularjs';
    expect(linebreak(text)).toBe('linebreak filter: ' + text);
  });

});
