'use strict';

angular.module('anorakApp')
  .directive('cloudinaryimage', function () {
    return {
      template: '<img ng-src="{{cloudinaryurl}}" />',
      restrict: 'E',
      scope: {
        "publicid": "@",
        "width": "@",
        "height": "@",
        "format": "@"
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        $.cloudinary.config({ cloud_name: 'dqe7zmb1k', api_key: '619226866778758'});
        scope.cloudinaryurl = $.cloudinary.url(scope.publicid + "." + scope.format, { width: scope.width, height: scope.height, crop: 'fill' });
      }
    };
  });
