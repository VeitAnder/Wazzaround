"use strict";
angular.module('momentjs', []).
  filter('fromNow', function () {
    return function (dateString) {
      return moment(dateString).fromNow();
    };
  })
  .filter('minusOneDay', function () {
    return function (dateString) {
      return moment(dateString).subtract('days', 1).toDate();
    };
  })
  .filter('momentjs', function ($translate) {
    return function (data, config) {
      moment.locale($translate.use());
      return moment(data).format(config.format);
    };
  })
  .filter('duration', function () {
    return function (data, config) {
      return moment.duration(moment(data.start) - moment(data.end)).humanize();
    };
  });