'use strict';

angular.module('anorakApp')
  .filter('sortedEvents', function () {
    return function (activity, filter) {

      var isItemEnabled = function (item) {
        if (!filter) return true;  // nicht filtern, wenn kein filter definiert ist

        return item.filter.enabled();
      };

      var isEventEnabled = function (event) {
        if (!filter) return true;  // nicht filtern, wenn kein filter definiert ist

        if (event.start < filter.from) return false;
        if (event.start > filter.until) return false;
        return true;
      };

      // erst mal filtern
      var sortedEvents = [];

      angular.forEach(activity.bookableItems, function (bookableItem) {
        if (isItemEnabled(bookableItem)) {
          angular.forEach(bookableItem.events, function (event) {
            if (isEventEnabled(event)) {
              sortedEvents.push({
                date: event.start,
                activity: activity,
                bookableItem: bookableItem,
                event: event
              });
            }
          });
        }
      });

      // dann nach datum sortieren
      sortedEvents = _.sortBy(sortedEvents, 'date');

      return sortedEvents;
    };
  });
