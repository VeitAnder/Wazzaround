'use strict';

describe('Filter: markercoordsfilter', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var markercoordsfilter;
  beforeEach(inject(function ($filter) {
    markercoordsfilter = $filter('markercoordsfilter');
  }));

  it('should return the input prefixed with "markercoordsfilter filter:"', function () {
    var text = 'angularjs';
    expect(markercoordsfilter(text)).toBe('markercoordsfilter filter: ' + text);
  });

});
