'use strict';

angular.module('anorakApp')
  .filter('markercoordsfilter', function (translationutils) {
    return function (activities, config) {
      _.each(activities, function (activity) {
        activity.longitude = activity.location.lng;
        activity.latitude = activity.location.lat;

        activity.markerOptions = {
          labelContent: activity.name[translationutils.getAvailableTranslationLanguageKey(activity.name)],
          labelAnchor: '22 0',
          labelClass: 'marker-labels marker-label-category-' + activity.category.main
        };

      });
      return activities;
    };
  });