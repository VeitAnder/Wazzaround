'use strict';

angular.module('anorakApp')
  .filter('markercoordsfilter', function () {
    return function (m, config) {
      _.each(m, function (marker) {
        marker.longitude = marker.location.lng;
        marker.latitude = marker.location.lat;
      });
      return m;
    };
  });