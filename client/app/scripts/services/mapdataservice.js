'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice($rootScope, models, $q, $http) {

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

    // all activities are filtered for a location, with a radius of 30 km.
    // if the activities are outside, dont display them on the map
    // TODO what about the zoom level??? Markers numbers should change with the zoom level --> zoom out --> see more markers
    var setMarkersInRadius = function () {

      var defer = Q.defer();
      var markersInRadius = [];

      models.ActivityModel.all()

        .then(function (activities) {

          mapdata.map.markers = activities;
          debug("ALL MARKERS", mapdata.map.markers.length);

          for (var i = 0; i < mapdata.map.markers.length; i++) {
            // calculate distance between center and the marker
            // if distance more than 30km, dont display
            // TODO later on filter activities(===markers) from db via lat-long range
            /////Activiews.use.find({...}).then(....)

            var distance = calculateDistance(mapdata.map.center.latitude, mapdata.map.center.longitude, mapdata.map.markers[i].latitude, mapdata.map.markers[i].longitude);
            if (distance < 100) {
              markersInRadius.push(mapdata.map.markers[i]);
            }
          }
          mapdata.map.markers = markersInRadius;
          debug("MARKERS IN RADIUS", markersInRadius.length);
          defer.resolve();
        })
        .fail(function (err) {
          debug("Could not get all activities", err);
          defer.reject(err);
        })
        .done();

      return defer.promise;
    };

    var geoCodeAddress = function (address) {

      var defer = $q.defer();

      if (!address) {
        defer.resolve("No address entered");
      } else {
        debug("GOT ADDRESS", address);
        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': address, 'region': 'it' }, function (results, status) {

          debug("FOUND ADDRESS!", status, results);

          if (status === google.maps.GeocoderStatus.OK) {
            mapdata.map.center.latitude = results[0].geometry.location.d;
            mapdata.map.center.longitude = results[0].geometry.location.e;
            mapdata.map.centerMarker.latitude = results[0].geometry.location.d;
            mapdata.map.centerMarker.longitude = results[0].geometry.location.e;
            mapdata.map.address = address;

            return defer.resolve();

          } else {
            debug("Status not OK!, failing", status);
            mapdata.map.center = standardCenter;
            mapdata.map.centerMarker = standardCenter;
            mapdata.map.center = standardCenter;
            defer.reject("Could not geocode address", status);
          }
        });
      }
      return defer.promise;
    };

    // filter activities according to date that the user entered
    // there may be a start date and an end date or only one of them or none
    var findActivitiesForDateRange = function (start, end) {
      debug("LOOKING FOR DATE RANGE", start, end);

      if (!start && !end) {   // it's not a search for date, so just return
        return;
      } else if (!start) {
        start = new Date();
      } else if (!end) {
        end = new Date(2099, 1, 1);
      }

      var activitiesIds = _.map(mapdata.map.markers, '_id');

      models.ActivityModel.getActivitiesFilterByTime({
        activitiesIds: activitiesIds,
        startDate: start,
        endDate: end
      })
        .then(function (activities) {
          debug("GOT DATE FILTERED ACTIVITIES", activities);
          mapdata.map.markers = activities;
        })
        .done();
    };

    var setMarkerOnMap = function (marker) {
      mapdata.map.markers = [];
      mapdata.map.markers.push(marker);
    };

    var mapdata = {
      searchActivities: function (startDate, endDate, address) {
        debug("SEARCHING START", startDate, "END ", endDate, " ADDR ", address);

        // user clicked "Search" on empty form
        if (!startDate && !endDate && !address) {
          debug("FOUND NONE OF SEARCH STUFF");

          models.ActivityModel.all()

            .then(function (activities) {
              debug("GOT ACTS", activities);
              mapdata.map.markers = activities;
              $rootScope.$broadcast("MapChangeEvent");
            })
            .catch(function (err) {
              debug("Could not get all activities", err);
            });

        } else {
          // set the address on the map and center map on that address
          geoCodeAddress(address)

            .then(function () {
              // set markers only in a special radius on this map
              return setMarkersInRadius();
            })

            .then(function () {
              // find only activities that are within a date range specified by the user
              findActivitiesForDateRange(startDate, endDate);

              debug("AM DONE SEARCHING IN SERVICE");
              $rootScope.$broadcast("MapChangeEvent");
            })

            .catch(function (err) {
              debug("Something went wrong while searching", err);
            });
        }
      },
      findAddressOnMap: function (marker) {
        if (!marker.address) {
          debug("FOUND NO ADDRESS");

        } else {

          geoCodeAddress(marker.address)
            .then(function () {
              console.log("DONE GEOCODING ADDRESS");     // TODO set marker on map
              setMarkerOnMap(marker);
              $rootScope.$broadcast("EditMapChangeEvent");
            })

            .catch(function (err) {
              debug("Something went wrong while searching address", err);
            });
        }
      },
      findAddressForCoordinates: function (latitude, longitude) {
        console.log("LOOKING FOR ADDRESS FOR", latitude, longitude);

        var latlng = new google.maps.LatLng(latitude, longitude);

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          console.log("CODED RESULTS", results, status);
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              console.log("SET ADDRESS TO MAP", results[1]);
              mapdata.map.address = results[1].formatted_address;
            } else {
              debug('No address found for coordinates');
            }
            $rootScope.$broadcast("SetAddressEvent");
            $rootScope.$apply();
          }
        });
      },
      getAddress: function (viewValue) {
        var params = {address: viewValue, sensor: false, language: 'it'};
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', { params: params })
          .then(function (res) {
            return res.data.results;
          });
      },
      map: {
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
          templateUrl: 'map/templatedinfowindow.html',
          templateParameter: {
            message: 'passed in from the opener'
          }
        },
        options: {
          zoomControl: {
            style: "SMALL"
          },
          panControl: false,
          overviewMapControl: false,
          mapTypeControl: false,
          streetViewControl: false
        },
        events: {
          click: function (mapModel, eventName, originalEventArgs) {
            console.log("USER CLICKED EVENT");
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

            if (mapdata.map.clickedMarker) {   // only the case in edit view
              mapdata.map.clickedMarker.latitude = e.latLng.lat();
              mapdata.map.clickedMarker.longitude = e.latLng.lng();
              mapdata.findAddressForCoordinates(mapdata.map.clickedMarker.latitude, mapdata.map.clickedMarker.longitude);
            }
          }
        }
      }
    };

    return mapdata;
  })
;
