'use strict';

angular.module('anorakApp')
  .filter('eventFilter', function () {
    return function (input, filter) {
      console.log('filter input:', input, filter);

      var activity = {};

      for (var i in input) {
        if (i !== 'bookableItems') {
          activity[i] = input[i];
        } else {
          activity[i] = [];
          for (var j=0; j<filter.bookableItems.length; j++) {
            if (filter.bookableItems[j].enabled()) { // selected
              activity[i].push(input.bookableItems[j]);
            }
          }
        }
      }


//      for (var i=filter.bookableItems.length-1 ; i>=0; i--) {
//        if (!filter.bookableItems[i].enabled()) {
//          activity.bookableItems.splice(i, 1)
//        }
//      }

      return activity;
    };
  });
