angular.module('momentjs', []).
  filter('fromNow',function () {
    "use strict";
    return function (dateString) {
      return moment(dateString).fromNow();
    };
  })
  .filter('momentjs', function ($translate) {
    "use strict";
    return function (data, config) {
      moment.lang($translate.use());
      return moment(data).format(config.format);
    };
  });