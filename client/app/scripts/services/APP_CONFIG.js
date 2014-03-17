angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {},
      apiversion = "/api/v1/";

    if ($window.location.hostname === "reacture.anorak.io" || $window.location.hostname === "reactureapp-11359.onmodulus.net") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + apiversion,
        debug: false,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/"
      };
    } else if ($window.location.hostname === "reactureappdev-10669.onmodulus.net" || $window.location.hostname === "dev.reacture.anorak.io") {
      // development server
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + apiversion,
        debug: false,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/"
      };
    } else {
      // localhost dev
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + ":3000"+ apiversion,
        debug: true,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + ":3000/"
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });