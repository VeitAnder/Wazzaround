angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {},
      apiversion = "/api/v1/";

    if ($window.location.hostname === "beta.reacture.com" || $window.location.hostname === "reactureapp-11359.onmodulus.net") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: $window.location.protocol + "//" + $window.location.hostname + apiversion,
        debug: false,
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/",
        modelizerhost : $window.location.hostname,
        modelizerport : 443,
        cloudinary : {
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        }
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
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + "/",
        cloudinary : {
          cloud_name: 'dqe7zmb1k',
          api_key: '619226866778758'
        }
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
        modelizerurl: $window.location.protocol + "//" + $window.location.hostname + ":3000/",
        modelizerhost : $window.location.hostname,
        modelizerport : 3000,
        cloudinary : {
          cloud_name: 'dqe7zmb1k',
          api_key: '619226866778758'
        }
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });