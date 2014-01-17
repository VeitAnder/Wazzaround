angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {};

    if ($window.location.hostname === "app.planfred.com") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "planfred",
          accesskey: "AKIAI737R7ONQ2EERBGA"
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + "/api/v1/",
        debug: false
      };
    } else if ($window.location.hostname === "planfreddevelopmentappserver-9403.onmodulus.net") {
      // development server
      hostconfig = {
        AmazonS3Config: {
          bucket: "planfreddevelopmentserver",
          accesskey: "AKIAJ3ZOH3CU4TZM6Z3A"
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + "/api/v1/",
        debug: true
      };
    } else {
      // localhost dev
      hostconfig = {
        AmazonS3Config: {
          bucket: "planfredlocalhost",
          accesskey: "AKIAJVNTGQMMDTGWNI4A"
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + ":3000/api/v1/",
        debug: true
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });