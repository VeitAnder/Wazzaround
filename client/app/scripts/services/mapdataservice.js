'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice() {

    console.log("AM IN MAPDATA SERVICE");

    var map = {
      center: {
        "longitude": 8.01177978515625,
        "latitude": 45.12199086176226

      },
      zoom: 9,
      markericon: "/img/mapicons/marker-sports.svg",
      templatedInfoWindow: {
        coords: {
          latitude: 44.93077975622578,
          longitude: 7.998046875
        },
        options: {
          disableAutoPan: true
        },
        show: true,
        templateUrl: 'views/map/templatedinfowindow.html',
        templateParameter: {
          message: 'passed in from the opener'
        }
      }
      /*,

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
       }*/
    };

    return map;
  });

