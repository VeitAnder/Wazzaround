'use strict';

angular.module('anorakApp')
  .filter('bookableList', function () {
    return function (input, limit) {
      var returned = 0;
      var res = [];

      limit = limit || Number.MAX_VALUE;

      console.log('filter', input);
      for (var i=0; i<input.length && returned < limit; i++) {

        // only if availabe
        if (input[i].event.availableQuantity > 0) {
          res.push(input[i]);
          returned++;
        }
      }

      return res;
    };
  });
