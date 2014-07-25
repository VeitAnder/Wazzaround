'use strict';

describe('Filter: bookableList', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var bookableList;
  beforeEach(inject(function ($filter) {
    bookableList = $filter('bookableList');
  }));

  it('should return the input prefixed with "bookableList filter:"', function () {
    var text = 'angularjs';
    expect(bookableList(text)).toBe('bookableList filter: ' + text);
  });

});
