angular.module('services.localizedMessages', [])
  .factory('localizedMessages', function ($interpolate, I18NMESSAGES) {
    "use strict";

    var handleNotFound = function (msg, msgKey) {
      return msg || '?' + msgKey + '?';
    };

    return {
      get: function (msgKey, interpolateParams) {
        var msg = I18NMESSAGES[msgKey];
        if (msg) {
          return $interpolate(msg)(interpolateParams);
        } else {
          return handleNotFound(msg, msgKey);
        }
      }
    };
  });