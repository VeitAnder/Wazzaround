"use strict";

angular.module('anorakApp')
  .factory('APP_CONFIG', function ($window) {
    var API_VERSION = '/api/v1';

    var hostconfig = {},
      globalconfig = {
        mobile: function () {
          return $window.innerWidth < 768;
        }()
      },
      apiversion = "/api/v1/";

    if ($window.location.hostname.indexOf("wazzaround.com") >= 0 || $window.location.hostname.indexOf("wwwwazzaroundcom.herokuapp.com") >= 0 || $window.location.hostname === "reacture.com" || $window.location.hostname === "www.reacture.com" || $window.location.hostname === "beta.reacture.com" || $window.location.hostname === "reactureapp-11359.onmodulus.net") {
      // PRODUCTION SERVER
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        API_PORT: 443,
        API_VERSION: API_VERSION,
        debug: false,
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
    } else if ($window.location.hostname.indexOf("devwwwwazzaroundcom.herokuapp.com") >= 0 || $window.location.hostname === "reactureappdev-10669.onmodulus.net" || $window.location.hostname === "dev.reacture.anorak.io") {
      // development server
      hostconfig = {
        AmazonS3Config: {
          bucket: "",
          accesskey: ""
        },
        API_PORT: 443,
        API_VERSION: API_VERSION,
        debug: false,
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
        API_PORT: 3000,
        API_VERSION: API_VERSION,
        debug: true,
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

    // API_URL
    if (hostconfig.API_PORT !== 80 && hostconfig.API_PORT !== 443) {
      hostconfig.API_URL = 'http://' + $window.location.hostname + ':' + hostconfig.API_PORT + API_VERSION;
    } else {
      if (hostconfig.API_PORT === 443) {
        hostconfig.API_URL = 'https://' + $window.location.hostname + API_VERSION;
      } else {
        hostconfig.API_URL = 'http://' + $window.location.hostname + API_VERSION;
      }
    }

    angular.extend(globalconfig, hostconfig);
    return globalconfig;
  });
