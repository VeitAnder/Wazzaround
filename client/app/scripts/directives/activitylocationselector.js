'use strict';

angular.module('anorakApp')
  .directive('activitylocationselector', function (activitybackendmap, $timeout) {
    return {
      templateUrl: 'views/directives/activitylocationselector.html',
      restrict: 'E',
      scope: {
        "activity": "=activity"
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {

            scope.activitybackendmap = activitybackendmap;

            scope.activitybackendmap.map.zoom = 9;

            // initialize map with data from activity
            scope.activitybackendmap.map.center = {
              "longitude": scope.activity.location.lng,
              "latitude": scope.activity.location.lat
            };
            scope.activitybackendmap.map.clickedMarker = {
              "longitude": scope.activity.location.lng,
              "latitude": scope.activity.location.lat
            };

            scope.setAddressViaAddressfield = function () {
              scope.activitybackendmap.geoCodeAddress(scope.activity.address)
                .then(function (coords) {
                  if (coords !== null) {

                    scope.activity.location = {
                      lng: coords.A,
                      lat: coords.k
                    };

                    $timeout(function () {
                      scope.activitybackendmap.map.clickedMarker.latitude = coords.k;
                      scope.activitybackendmap.map.clickedMarker.longitude = coords.A;

                      scope.activitybackendmap.map.center.latitude = coords.k;
                      scope.activitybackendmap.map.center.longitude = coords.A;
                    });
                  }
                });
            };

            scope.getGoogleAddressAutoCompletionList = function (viewValue) {
              return activitybackendmap.getGoogleAddressAutoCompletionList(viewValue);
            };

            scope.activitybackendmap.map.events = {
              click: function (mapModel, eventName, originalEventArgs) {
                var e;
                if (!originalEventArgs) {
                  e = {
                    latLng: {
                      lat: function () {
                        return scope.activitybackendmap.map.center.latitude;
                      },
                      lng: function () {
                        return scope.activitybackendmap.map.center.longitude;
                      }
                    }
                  };
                } else {
                  e = originalEventArgs[0];
                }

                $timeout(function () {
                  scope.activitybackendmap.map.clickedMarker.latitude = e.latLng.lat();
                  scope.activitybackendmap.map.clickedMarker.longitude = e.latLng.lng();
                });

                scope.activitybackendmap.findAddressForCoordinates(e.latLng.lat(), e.latLng.lng())
                  .then(function (address) {
                    $timeout(function () {
                      scope.activity.address = address;
                      scope.activity.location = {
                        lng: e.latLng.lng(),
                        lat: e.latLng.lat()
                      };
                    });
                  });
              }
            };

          },
          post: function postLink(scope, iElement, iAttrs, controller) {

          }
        };

      }
    };

  });
