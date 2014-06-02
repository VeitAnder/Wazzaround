'use strict';

angular.module('anorakApp')
  .directive('cloudinaryimage', function (APP_CONFIG, $timeout) {
    return {
      template: '<img ng-src="{{getCloudinaryurl()}}" ng-hide="states.noid"/> ',
      restrict: 'E',
      scope: {
        "publicid": "@publicid",
        "width": "@",
        "height": "@",
        "format": "@format"
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.states = {
          noid: false
        };

        $.cloudinary.config({ cloud_name: APP_CONFIG.cloudinary.cloud_name, api_key: APP_CONFIG.cloudinary.api_key});
        scope.getCloudinaryurl = function () {
          var url;
          if (scope.publicid !== "") {
            scope.states.noid = false;
            url = $.cloudinary.url(scope.publicid + "." + scope.format, { width: scope.width, height: scope.height, crop: 'fill' });
          } else {
            scope.states.noid = true;
            url = "#";
          }
          return url;
        };
      }
    };
  });