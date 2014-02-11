'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice($rootScope) {

    var geocoder;
    var map;
    var standardCenter = {
      "longitude": 8.01177978515625,
      "latitude": 45.12199086176226
    };

    var mapdataservice = {
      setAddress: function geoCodeAddress(address) {
        var defer = Q.defer();

        geocoder = new google.maps.Geocoder();


        geocoder.geocode({ 'address': address }, function (results, status) {

          console.log("FOUND ADDRESS!", status);

          if (status == google.maps.GeocoderStatus.OK) {
            mapdataservice.map.center.latitude = results[0].geometry.location.d;
            mapdataservice.map.center.longitude = results[0].geometry.location.e;
            mapdataservice.map.address = address; // TODO remove later, is only for controlling

            $rootScope.$broadcast("MapChangeEvent");  // TODO better way than this to send new map center?

            return defer.resolve();

          } else {
            console.log("Status not OK!, failing", status);
            mapdataservice.map.center = standardCenter;
            return defer.reject("Could not geocode address", status);
          }
        });

        return defer.promise;
      },

      map: {
        address: "",
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
      }
    };

    return mapdataservice;
  });
