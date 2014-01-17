angular.module('directives.spinner', [])
  .directive('spinner', function (httpRequestTracker) {
    "use strict";

    return {
      restrict: 'A',
      replace: true,
      template: '<div class="spinner" ng-show="hasPendingRequests()"> <span>{{spinnertext}}</span><div>',
      link: function (scope, elem, attrs) {
        var color;
        if (attrs.spinnercolor) {
          color = attrs.spinnercolor;
        } else {
          color = "#FF5400";
        }

        if (typeof attrs.spinnertext === "string" && attrs.spinnertext.length > 0) {
          scope.spinnertext = attrs.spinnertext;
        } else if (typeof attrs.spinnertext === "string" && attrs.spinnertext.length < 1) {
          scope.spinnertext = "";
        } else {
          scope.spinnertext = "lädt …";
        }

        var opts = {
          lines: 11, // The number of lines to draw
          length: 3, // The length of each line
          width: 2, // The line thickness
          radius: 5, // The radius of the inner circle
          corners: 0, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: color, // #rgb or #rrggbb or array of colors
          speed: 1.5, // Rounds per second
          trail: 100, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: '0px', // Top position relative to parent in px
          left: '0px' // Left position relative to parent in px
        };
        new Spinner(opts).spin(elem[0]);

        scope.hasPendingRequests = function () {
          return httpRequestTracker.hasPendingRequests();
        };

      }
    };
  });
