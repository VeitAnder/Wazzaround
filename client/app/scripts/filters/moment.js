angular.module('momentjs', []).
  filter('fromNow',function () {
    "use strict";
    return function (dateString) {
      return moment(dateString).fromNow();
    };
  })
  .filter('momentjs', function () {
    "use strict";
    return function (data, config) {
      return moment(data).format(config.format);
    };
  });