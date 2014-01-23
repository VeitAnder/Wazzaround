'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedactivities) {
    $scope.activities = resolvedactivities;

    $scope.map = {
      center: {
        latitude: 33,
        longitude: 33
      },
      zoom: 8,
      markers: $scope.activities,
      markericon: "img/mapicons/plane.png",
      templatedInfoWindow: {
        coords: {
          latitude: 33,
          longitude: 33
        },
        options:{
          disableAutoPan:true
        },
        show: true,
        templateUrl: 'views/map/templatedinfowindow.html',
        templateParameter: {
          message: 'passed in from the opener'
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

    $scope.changelist = function () {
      $scope.activities.pop();
    };

  });
