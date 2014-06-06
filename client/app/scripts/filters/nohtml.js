'use strict';

angular.module('anorakApp')
  .filter('nohtml', function () {
    return function (text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;');
    };
  });
