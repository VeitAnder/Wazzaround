'use strict';

angular.module('anorakApp')
  .filter('readableid', function () {
    return function (text) {
      return text.match(/.{1,4}/g).join("-");
    };
  });
