'use strict';

angular.module('anorakApp')
  .filter('bookableList', function () {
    return function (input, limit) {
      var returned = 0;
      var res = [];

      limit = limit || Number.MAX_VALUE;

      for (var i = 0; i < input.length && returned < limit; i++) {

        // only if availabe
        if (input[i].event.availableQuantity > 0) {
          res.push(input[i]);
          returned++;
        }
      }

      return res;
    };
  })
  .filter('removeBookingAlreadyEnded', function () {
    return function (events) {
      return events.filter(function (event) {
        if (event && event.event && event.event.bookingEndsAt) {
          return new Date(event.event.bookingEndsAt) > new Date();
        } else {
          return true;
        }
      });
    };
  })
  .filter('filterEventsByDatesInFrontendMap', function (frontendmap) {
    return function (input, limit) {
      // filter events based on start and end date in map filter / frontendmap
      input.forEach(function (eventsList) {
        console.log("eventsList", eventsList);
        eventsList.events = _.filter(eventsList.events, function (event) {
          //return event.start > frontendmap.map.searchStartDate && event.end < frontendmap.map.searchEndDate;
          return new Date(event.start) > new Date(frontendmap.map.searchStartDate) && new Date(event.end) < new Date(frontendmap.map.searchEndDate);
        });
      });

      return input;
    };
  });
