'use strict';

describe('Filter: adddistancetosearchlocation', function () {

  // load the filter's module
  beforeEach(module('anorakApp'));

  // initialize a new instance of the filter before each test
  var adddistancetosearchlocation;
  beforeEach(inject(function ($filter) {
    adddistancetosearchlocation = $filter('adddistancetosearchlocation');
  }));

  it('should return the input prefixed with "adddistancetosearchlocation filter:"', function () {
    var text = 'angularjs';
    expect(adddistancetosearchlocation(text)).toBe('adddistancetosearchlocation filter: ' + text);
  });

});
