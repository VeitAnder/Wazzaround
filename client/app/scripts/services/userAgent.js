angular.module('anorakApp')
  .factory('userAgent', function () {
    "use strict";

    return new UAParser();
  });
