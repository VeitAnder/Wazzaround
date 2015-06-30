'use strict';

angular.module('anorakApp')
  .directive('activitylocationselector', function activitylocationselectorFactory(activitybackendmap, $timeout) {

    var controller = function () {
      var self = this;

      this.activitybackendmap = activitybackendmap;

      this.activitybackendmap.map.zoom = 9;

      // initialize map with data from activity
      this.activitybackendmap.map.center = {
        "longitude": self.activity.location.lng,
        "latitude": self.activity.location.lat
      };
      this.activitybackendmap.map.clickedMarker = {
        "longitude": self.activity.location.lng,
        "latitude": self.activity.location.lat
      };

      this.setAddressViaAddressfield = function () {
        self.activitybackendmap.geoCodeAddress(self.activity.address)
          .then(function (coords) {
            if (coords !== null) {

              self.activity.location = {
                lng: coords.lng(),
                lat: coords.lat()
              };

              $timeout(function () {
                self.activitybackendmap.map.clickedMarker.latitude = coords.lat();
                self.activitybackendmap.map.clickedMarker.longitude = coords.lng();

                self.activitybackendmap.map.center.latitude = coords.lat();
                self.activitybackendmap.map.center.longitude = coords.lng();
              });
            }
          });
      };

      this.getGoogleAddressAutoCompletionList = function (viewValue) {
        return activitybackendmap.getGoogleAddressAutoCompletionList(viewValue);
      };

      this.activitybackendmap.map.events = {
        click: function (mapModel, eventName, originalEventArgs) {
          var e;
          if (!originalEventArgs) {
            e = {
              latLng: {
                lat: function () {
                  return self.activitybackendmap.map.center.latitude;
                },
                lng: function () {
                  return self.activitybackendmap.map.center.longitude;
                }
              }
            };
          } else {
            e = originalEventArgs[0];
          }

          $timeout(function () {
            self.activitybackendmap.map.clickedMarker.latitude = e.latLng.lat();
            self.activitybackendmap.map.clickedMarker.longitude = e.latLng.lng();
          });

          self.activitybackendmap.findAddressForCoordinates(e.latLng.lat(), e.latLng.lng())
            .then(function (address) {
              $timeout(function () {
                self.activity.address = address;
                self.activity.location = {
                  lng: e.latLng.lng(),
                  lat: e.latLng.lat()
                };
              });
            });
        }
      };
    };

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: {
        "activity": "="
      },
      controller: controller,
      controllerAs: 'ctrl',
      bindToController: true, //required in 1.3+ with controllerAs
      templateUrl: 'views/directives/activitylocationselector.html'
    };
    return directiveDefinitionObject;
  }
);
