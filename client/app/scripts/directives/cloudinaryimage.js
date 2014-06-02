'use strict';

angular.module('anorakApp')
  .directive('cloudinaryimage', function (APP_CONFIG) {
    return {
      template: '<img ng-show="publicid" ng-src="{{getCloudinaryurl()}}" /> ',
      restrict: 'E',
      scope: {
        "publicid": "@publicid",
        "width": "@",
        "height": "@",
        "format": "@format"
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        $.cloudinary.config({ cloud_name: APP_CONFIG.cloudinary.cloud_name, api_key: APP_CONFIG.cloudinary.api_key});
        scope.getCloudinaryurl = function () {
          return $.cloudinary.url(scope.publicid + "." + scope.format, { width: scope.width, height: scope.height, crop: 'fill' });
        };
      }
    };
  });