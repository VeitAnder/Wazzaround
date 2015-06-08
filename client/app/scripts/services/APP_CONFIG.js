angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    "use strict";
    var hostconfig = {},
      globalconfig = {},
      apiversion = "/api/v1/";

    if ($window.location.hostname.indexOf("wazzaround.com") >= 0 || $window.location.hostname.indexOf("wwwwazzaroundcom.herokuapp.com") >= 0 || $window.location.hostname === "reacture.com" || $window.location.hostname === "www.reacture.com" || $window.location.hostname === "beta.reacture.com" || $window.location.hostname === "reactureapp-11359.onmodulus.net") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: "https://" + $window.location.hostname + apiversion,
        debug: false,
        modelizerurl: "https://" + $window.location.hostname + "/",
        modelizerhost: $window.location.hostname,
        modelizerport: 443,
        cloudinary: {
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        },
        paymillPublicKey: '8a8394c246a5a1360146a947ae7c07d7',  // public live key!
        logentries: (function () {
          LE.init({
            token: '494b5c55-c781-46fe-bf1c-7a333925a72f',
            catchall: true
          });
        })()
      };
    } else if ($window.location.hostname === "reactureappdev-10669.onmodulus.net" || $window.location.hostname === "dev.reacture.anorak.io") {
      // development server
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: "https://" + $window.location.hostname + apiversion,
        debug: false,
        modelizerurl: "https://" + $window.location.hostname + "/",
        cloudinary: {
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        },
        paymillPublicKey: '744618362999c5386cdc5e61fee63d2c',  // test key
        logentries: (function () {
          LE.init({
            token: 'd706eeab-a959-4342-86b7-657cb7212922',
            catchall: true
          });
        })()
      };
    } else {
      // localhost dev
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        APIUrl: "http://" + $window.location.hostname + ":3000" + apiversion,
        debug: true,
        modelizerurl: "http://" + $window.location.hostname + ":3000/",
        modelizerhost: $window.location.hostname,
        modelizerport: 3000,
        cloudinary: {
          cloud_name: 'www-reacture-com',
          api_key: '162329319871877'
        },
        paymillPublicKey: '744618362999c5386cdc5e61fee63d2c',  // test key
        logentries: (function () {
/*          LE.init({
            token: '',
            catchall: true
          });*/
        })()
      };
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });
