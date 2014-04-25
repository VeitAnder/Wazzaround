'use strict';

angular.module('anorakApp')
  .service('activitybackendmap', function activitybackendmap(basicmapdata, $rootScope) {

    var mapdata = new basicmapdata();

    mapdata.map.clickedMarker = {
      title: 'Location of activity',
      latitude: null,
      longitude: null
    };

    mapdata.centerMapAndMarker = function (marker) {
      console.log("CENTER MAP AND MARKER", marker.latitude);
      if (marker.latitude && marker.longitude) {
        mapdata.map.center.latitude = marker.latitude;
        mapdata.map.center.longitude = marker.longitude;
        mapdata.map.clickedMarker.latitude = marker.latitude;
        mapdata.map.clickedMarker.longitude = marker.longitude;

      } else {
        mapdata.map.center.latitude = mapdata.map.standardCenter.latitude;
        mapdata.map.center.longitude = mapdata.map.standardCenter.longitude;
        mapdata.map.clickedMarker = {
          title: 'Location of activity',
          latitude: null,
          longitude: null
        };
      }
    };

    mapdata.map.events = {
      click: function (mapModel, eventName, originalEventArgs) {
        var e;
        if (!originalEventArgs) {
          e = {
            latLng: {
              lat: function () {
                return mapdata.map.center.latitude;
              },
              lng: function () {
                return mapdata.map.center.longitude;
              }
            }
          };
        } else {
          e = originalEventArgs[0];
        }
        console.log("CLICK ACTIVITY", e.latLng.lat());
        mapdata.map.clickedMarker.latitude = e.latLng.lat();
        mapdata.map.clickedMarker.longitude = e.latLng.lng();
        mapdata.findAddressForCoordinates(mapdata.map, mapdata.map.clickedMarker.latitude, mapdata.map.clickedMarker.longitude);
      }
    };

    mapdata.findAddressOnMap = function (marker) {
      console.log("findAddressOnMap");

//      if (!marker.address) {
//        debug("FOUND NO ADDRESS");
//      } else {
//        geoCodeAddress(marker.address)
//          .then(function (coords) {
//            debug("DONE GEOCODING ADDRESS");     // TODO set marker on map
//            setMarkerOnMap(marker);
//            $rootScope.$broadcast("EditMapChangeEvent");
//          })
//          .catch(function (err) {
//            debug("Something went wrong while searching address", err);
//          });
//      }
    };




    return mapdata;
  });