'use strict';

angular.module('anorakApp')
  .filter('linebreak', function () {
    return function (text) {
      return text.replace(/\n/g, '<br/>');
    };
  });
