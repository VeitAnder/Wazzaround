'use strict';

describe('Filter: languageselect', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var languageselect;
  beforeEach(inject(function ($filter) {
    languageselect = $filter('languageselect');
  }));

  it('should return the input prefixed with "languageselect filter:"', function () {
    var text = 'angularjs';
    expect(languageselect(text)).toBe('languageselect filter: ' + text);
  });

});
