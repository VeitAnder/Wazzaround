'use strict';

describe('Filter: languagefilter', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var languagefilter;
  beforeEach(inject(function ($filter) {
    languagefilter = $filter('languagefilter');
  }));

  it('should return the input prefixed with "languagefilter filter:"', function () {
    var text = 'angularjs';
    expect(languagefilter(text)).toBe('languagefilter filter: ' + text);
  });

});
