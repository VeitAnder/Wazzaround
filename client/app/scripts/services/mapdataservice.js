'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice($rootScope) {

    var geocoder;
    var standardCenter = {
      "longitude": 8.01177978515625,
      "latitude": 45.12199086176226
    };

    // optimized formula for calculation of distance between two points, because lib geometry is missing from angular-google-maps
    var calculateDistance = function (lat1, lon1, lat2, lon2) {
      var R = 6371;
      var a =
        0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;

      return R * 2 * Math.asin(Math.sqrt(a));
    };

    var mapdata = {
      setAddress: function geoCodeAddress(address) {
        var defer = Q.defer();

        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': address, 'region': 'it' }, function (results, status) {

          console.log("FOUND ADDRESS!", status, results);

          if (status === google.maps.GeocoderStatus.OK) {
            mapdata.map.center.latitude = results[0].geometry.location.d;
            mapdata.map.center.longitude = results[0].geometry.location.e;
            mapdata.map.centerMarker.latitude = results[0].geometry.location.d;
            mapdata.map.centerMarker.longitude = results[0].geometry.location.e;
            mapdata.map.address = address; // TODO remove later, is only for controlling

            var markersInRadius = [];
            for (var i = 0; i < mapdata.map.markers.length; i++) {
//              console.log("CHECK MARKER", mapdata.map.markers[i]);
//              console.log("THE DISTANCE IS", calculateDistance(mapdata.map.center.latitude, mapdata.map.center.longitude, mapdata.map.markers[i].latitude, mapdata.map.markers[i].longitude));

              // calculate distance between center and the marker
              // if distance more than 30km, dont display
              // TODO later on filter activities(===markers) from db via lat-long range
              /////Activiews.use.find({...}).then(....)

              var distance = calculateDistance(mapdata.map.center.latitude, mapdata.map.center.longitude, mapdata.map.markers[i].latitude, mapdata.map.markers[i].longitude);
              if (distance < 30) {
                console.log("DISTANCE FIT FOR MARKER");
                markersInRadius.push(mapdata.map.markers[i]);
              }
            }

//            console.log("GOT MARKERS NOW", markersInRadius);
            mapdata.map.markers = markersInRadius;
            $rootScope.$broadcast("MapChangeEvent");
            return defer.resolve();

          } else {
            console.log("Status not OK!, failing", status);
            mapdata.map.center = standardCenter;
            mapdata.map.centerMarker = standardCenter;
            mapdata.map.center = standardCenter;
            return defer.reject("Could not geocode address", status);
          }
        });

        return defer.promise;
      },

      map: {
        circle: 0,
        address: "",
        center: {
          "longitude": 8.01177978515625,
          "latitude": 45.12199086176226
        },
        centerMarker: {
          title: 'Your current search location ',
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
      }
    };

    return mapdata;
  });
