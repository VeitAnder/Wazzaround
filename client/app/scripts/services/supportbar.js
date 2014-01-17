angular.module('services.supportbar', [])
  .factory('supportbar', function () {
    "use strict";

    var status = {
      open: false
    };

    var supportbar = {};

    supportbar.toggle = function () {
      status.open = !status.open;
    };

    supportbar.open = function () {
      status.open = true;
    };

    supportbar.close = function () {
      status.open = false;
    };

    supportbar.isSupportBarOpen = function () {
      return status.open;
    };

    return supportbar;
  });