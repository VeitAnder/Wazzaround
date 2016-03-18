'use strict';

angular.module('anorakApp')
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
        eventsList.events = _.filter(eventsList.events, function (event) {
          //return event.start > frontendmap.map.searchStartDate && event.end < frontendmap.map.searchEndDate;
          return new Date(event.start) > new Date(frontendmap.map.searchStartDate) && new Date(event.end) < new Date(frontendmap.map.searchEndDate);
        });
      });

      return input;
    };
  });
