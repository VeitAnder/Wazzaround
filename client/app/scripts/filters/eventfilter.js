'use strict';

angular.module('anorakApp')
  .filter('eventFilter', function () {
    return function (input) {
      console.log('filter input:', input, filter);

      //var activity = angular.copy(input);
      var activity = input;


      return input;
    };
  });
