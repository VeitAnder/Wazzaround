'use strict';

angular.module('anorakApp')
  .filter('mtokm', function () {
    return function (input) {
      return (input / 1000).toFixed(1);
    };
  });
