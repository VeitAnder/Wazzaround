'use strict';

angular.module('anorakApp')
  .directive('activitylocationselector', function (activitybackendmap) {
    return {
      templateUrl: 'views/directives/activitylocationselector.html',
      restrict: 'E',
      scope: {

      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {
            scope.activitybackendmap = activitybackendmap;

            scope.setAddressOnMap = function () {
              console.log("setAddressOnMap");
              activitybackendmap.findAddressOnMap(activitybackendmap.map, scope.activity);
//          scope.map = activitybackendmap.map;
            };
//

            scope.getGoogleAddressAutoCompletionList = function (viewValue) {
              return activitybackendmap.getGoogleAddressAutoCompletionList(viewValue);
            };

            scope.activitydata = {
              address: ""
            };

          },
          post: function postLink(scope, iElement, iAttrs, controller) {



//        scope.getAddress = activitybackendmap.getAddress;

//        scope.map = activitybackendmap.map;

//        activitybackendmap.centerMapAndMarker(scope.activity);

//        scope.getMarkerIcon = function () {
//          if (scope.activity.category.main) {
//            return "/img/mapicons/marker-" + scope.activity.category.main + ".svg";
//          } else {
//            return "/img/mapicons/marker.svg";
//          }
//        };
//
//        scope.getMarkerLabel = function () {
//          return "Activity location";
//        };
//
//        // address:
//        // user enters address
//        // address will be set on

//        $rootScope.$on("SetAddressEvent", function (event, message) {
//          if (scope.map.address) {
//            scope.activity.address = scope.map.address;
//          }
//          scope.activity.location.lat = scope.map.clickedMarker.latitude;
//          scope.activity.location.lng = scope.map.clickedMarker.longitude;
//        });

//        $rootScope.$on("EditMapChangeEvent", function (event, message) {
//          debug("EDIT MAP CHANGED !!! MARKERS: ", scope.map.markers);
//          //update model and set marker to display result to user
//          scope.activity.location.lat = scope.map.center.latitude;
//          scope.activity.location.lng = scope.map.center.longitude;
//          scope.map.clickedMarker.latitude = scope.map.center.latitude; // TODO move to service?
//          scope.map.clickedMarker.longitude = scope.map.center.longitude;
//          scope.map.clickedMarker.title = 'Location of activity';
//        });

          }
        };

      }
    };

  });
