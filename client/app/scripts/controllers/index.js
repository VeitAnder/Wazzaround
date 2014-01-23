'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedactivities) {
    $scope.activities = resolvedactivities;

    debug("resolvedactivities", resolvedactivities);
    $scope.map = {
      center: {
        latitude: 33,
        longitude: 33
      },
      zoom: 5,
      markers: $scope.activities,
      markericon: "img/mapicons/plane.png",
      templatedInfoWindow: {
        coords: {
          latitude: 33,
          longitude: 33
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'views/map/templatedinfowindow.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      },
      events: {
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope
          debug("user defined event: " + eventName, mapModel, originalEventArgs);

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          }
          else {
            $scope.map.clickedMarker.latitude = e.latLng.lat();
            $scope.map.clickedMarker.longitude = e.latLng.lng();
          }

          $scope.$apply();
        }
      }
    };

    $scope.markerClickHandler = function (marker) {
      debug("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!");
      marker.showWindow = true;
    };

    $scope.markerOptions = {
      "animation": "DROP"
    };

    $scope.windowOptions = {
      "content": '<div>hello you!</div>'
    };

    // filter activities
    $scope.onlySports = function (activity) {
      if (activity.category === "sports") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlyCulture = function (activity) {
      if (activity.category === "culture") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlyWellness = function (activity) {
      if (activity.category === "wellness") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlySelected = function (activity) {
      if (activity.hidden) {
        return false;
      } else {
        return true;
      }
    };

    $scope.toggleItemSelection = function (item) {
      debug("item select toggle on: ", item);
      item.hidden = !item.hidden;
    };

  });
