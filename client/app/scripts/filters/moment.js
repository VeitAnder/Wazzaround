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
      moment.lang($translate.use());
      return moment(data).format(config.format);
    };
  });