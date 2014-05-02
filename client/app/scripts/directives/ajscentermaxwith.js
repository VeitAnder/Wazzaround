'use strict';

angular.module('anorakApp')
  .directive('ajsCentermaxwith', function ($window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var maxWidth = 650;
        var $el = angular.element(element);

        var margin = 100;

        var getWidth = function () {
          // @TODO - hacky access on .activitybar width outside of scope of this directive!!
          var activitybarwidth = $(".map-wrap").width();
          if (activitybarwidth - (margin * 2) > maxWidth) {
            return maxWidth;
          } else {
            return activitybarwidth - (margin * 2);
          }
        };

        var center = function () {
          $el.css({
            "marginLeft": "-" + (getWidth() / 2) + "px",
            "width": getWidth() + "px"
          });
        };
        center();

        $($window).resize(function () {
          center();
        });
      }
    };
  });