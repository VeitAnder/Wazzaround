angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {},
      apiversion = "/api/v1/";

    if ($window.location.hostname === "reacture.com" || $window.location.hostname === "www.reacture.com" || $window.location.hostname === "beta.reacture.com" || $window.location.hostname === "reactureapp-11359.onmodulus.net") {
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
        },
        paymillPublicKey : '8a8394c246a5a1360146a947ae7c07d7'  // public live key!
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
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        },
        paymillPublicKey : '744618362999c5386cdc5e61fee63d2c'  // test key
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
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        },
        paymillPublicKey : '744618362999c5386cdc5e61fee63d2c'  // test key
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });
