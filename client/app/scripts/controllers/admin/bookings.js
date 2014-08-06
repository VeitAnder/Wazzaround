'use strict';

angular.module('anorakApp')
  .controller('AdminBookingsCtrl', function ($scope, $location, bookedEvents) {
    $scope.getPagePartial = function () {
      return 'views/admin/bookings.html';
    };

    // init links to activityCopy (at booking-time)
    _.forEach(bookedEvents, function(bookedEvent) {
      bookedEvent.item = bookedEvent.getChild(bookedEvent.item._link);
      bookedEvent.event = bookedEvent.getChild(bookedEvent.event._link);
      var booking_id = bookedEvent.booking._reference;
      bookedEvent.booking_id = booking_id.substring(booking_id.length-4);
    });

    $scope.bookedEvents = bookedEvents;

  });