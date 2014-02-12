angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {};

    if ($window.location.hostname === "reacture.com") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + "/api/v1/",
        debug: false,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/"
      };
    } else if ($window.location.hostname === "reactureappdev-10669.onmodulus.net" || $window.location.hostname === "reacture.anorak.io") {
      // development server
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + "/api/v1/",
        debug: true,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/"
      };
    } else {
      // localhost dev
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + ":3000/api/v1/",
        debug: true,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + ":3000/"
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });