'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 http://stackoverflow.com/questions/13619837/angular-js-inject-new-instance-of-class
 */
angular.module('anorakApp')
  .factory('basicmapdata', function ($rootScope, models, $q, $http, Usersessionstates) {

    var mapdata = function () {
      var geocoder;

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
      var setMarkersInRadius = function (map) {
        var markersInRadius = [];
        for (var i = 0; i < map.markers.length; i++) {
          // calculate distance between center and the marker
          // if distance more than 100km, dont display
          // TODO later on filter activities(===markers) from db via lat-long range
          /////Activiews.use.find({...}).then(....)

          var distance = calculateDistance(map.center.latitude, map.center.longitude, map.markers[i].latitude, map.markers[i].longitude);
          if (distance < 100) {
            markersInRadius.push(map.markers[i]);
          }
        }
        map.markers = markersInRadius;
        debug("MARKERS IN RADIUS", markersInRadius.length);
      };

      var geoCodeAddress = function (map, address) {

        var defer = $q.defer();

        if (!address) {
          defer.resolve("No address entered");
        } else {
          debug("GOT ADDRESS", address);
          geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'address': address, 'region': 'it' }, function (results, status) {

            debug("FOUND ADDRESS!", status, results);

            if (status === google.maps.GeocoderStatus.OK) {
              map.center.latitude = results[0].geometry.location.k;
              map.center.longitude = results[0].geometry.location.A;
              map.centerMarker.latitude = results[0].geometry.location.k;
              map.centerMarker.longitude = results[0].geometry.location.A;
              map.address = address;

              return defer.resolve();

            } else {
              debug("Status not OK!, failing", status);
              map.center = map.standardCenter;
              map.centerMarker = map.standardCenter;
              map.center = map.standardCenter;
              defer.reject("Could not geocode address", status);
            }
          });
        }
        return defer.promise;
      };

      // filter activities according to date that the user entered
      // there may be a start date and an end date or only one of them or none
      // then filter activities that are within a northeast and southwest lat/lng
      var findActivitiesForDateRangeAndBetweenBounds = function (map, start, end) {
        var defer = Q.defer();

        debug("LOOKING FOR DATE RANGE", start, end);

        if (!start && !end) {   // it's not a search for date, so just return all activities
          return getAllActivitiesAndSetToMap(map);
        } else if (!start) {
          start = new Date();
        } else if (!end) {
          end = new Date(2099, 1, 1);  // TODO check date magic
        }

        models.ActivityModel.filteredActivities({
          from: {  // links oben = northeast
            longitude: map.bounds.northeast.longitude,
            latitude: map.bounds.northeast.latitude
          },
          to: {  // rechts unten = southwest
            longitude: map.bounds.southwest.longitude,
            latitude: map.bounds.southwest.latitude
          },
          startDate: start,
          endDate: end
        })
          .then(function (activities) {
            debug("GOT DATE FILTERED ACTIVITIES", activities);
            map.markers = activities;
            defer.resolve();
          })
          .fail(function (err) {
            debug("Error in date filtering", err);
            defer.reject();
          })
          .done();

        return defer.promise;
      };

      var setMarkerOnMap = function (map, marker) {
        map.markers = [];
        map.markers.push(marker);
      };

      var getAllActivitiesAndSetToMap = function (map) {
        var defer = Q.defer();

        models.ActivityModel.all()
          .then(function (activities) {
            map.markers = activities;
            defer.resolve();
          })
          .catch(function (err) {
            debug("Could not get all activities", err);
          });
        return defer.promise;
      };

      this.mapdata = {
        // when user first loads the map, we get all activities from controller. They need to be filtered for radius
        showInitialActivities: function (map, activities) {
          map.markers = activities;
          setMarkersInRadius(map);
          debug("INIT ACTIVITIES");
        },
        searchActivities: function (map, startDate, endDate, address) {
          debug("SEARCHING START", startDate, "END ", endDate, " ADDR ", address);

          findActivitiesForDateRangeAndBetweenBounds(map, startDate, endDate)
            .then(function () {
              return geoCodeAddress(map, address);
            })

            .then(function () {
              setMarkersInRadius(map);
              debug("AM DONE SEARCHING IN SERVICE");
              $rootScope.$broadcast("MapChangeEvent");
            })

            .catch(function (err) {
              debug("Something went wrong while searching activities", err);
            });

        },
        findAddressOnMap: function (map, marker) {
          if (!marker.address) {
            debug("FOUND NO ADDRESS");

          } else {

            geoCodeAddress(map, marker.address)
              .then(function () {
                console.log("DONE GEOCODING ADDRESS");     // TODO set marker on map
                setMarkerOnMap(map, marker);
                $rootScope.$broadcast("EditMapChangeEvent");
              })

              .catch(function (err) {
                debug("Something went wrong while searching address", err);
              });
          }
        },
        findAddressForCoordinates: function (map, latitude, longitude) {
          console.log("LOOKING FOR ADDRESS FOR", latitude, longitude);

          var latlng = new google.maps.LatLng(latitude, longitude);

          geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            console.log("CODED RESULTS", results, status);
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                console.log("SET ADDRESS TO MAP", results[1]);
                map.address = results[1].formatted_address;
              } else {
                debug('No address found for coordinates');
              }
              $rootScope.$broadcast("SetAddressEvent");
              $rootScope.$apply();
            }
          });
        },
        getAddress: function (viewValue) {
          var params = {address: viewValue, sensor: false, language: 'en'};
          return $http.get('https://maps.googleapis.com/maps/api/geocode/json', { params: params })
            .then(function (res) {
              return res.data.results;
            });
        },
        initializeMapWithUserSearchLocation: function (map) {
          var deferred = Q.defer();

          // dont update Usersessionstates here, it will overwrite stuff !!!
          function setInitPositionOnMap(position) {
            map.centerMarker.latitude = position.coords.latitude;
            map.centerMarker.longitude = position.coords.longitude;
            map.center.latitude = position.coords.latitude;
            map.center.longitude = position.coords.longitude;
            deferred.resolve(map);
          }

          function couldNotGetInitPosition(err) {
            debug("Could not set initial location, will initialize with default Torino", err);
            deferred.resolve(map);
          }

          Usersessionstates.loadSession();

          // if there are Usersessionstates stored, check what is stored and fill into map
          if ((Usersessionstates.states && Usersessionstates.states.searchlocation && Usersessionstates.states.searchlocation.coords) || !navigator.geolocation) {
            setInitPositionOnMap(Usersessionstates.states.searchlocation);
            if (Usersessionstates.states.zoom) {
              map.zoom = Usersessionstates.states.zoom;
            }
            if (Usersessionstates.states.bounds) {
              map.bounds = Usersessionstates.states.bounds;
            }

          } else {
            // try to get user's position
            // it works --> map is filled with new data, set that data to Usersessionstates
            // it fails --> map is filled with standard data, set that data to Usersessionstates
            // update Usersessionstates
            navigator.geolocation.getCurrentPosition(setInitPositionOnMap, couldNotGetInitPosition);
            Usersessionstates.states = {
              searchlocation: {
                coords: {
                  latitude: map.center.latitude,
                  longitude: map.center.longitude
                }
              },
              zoom: map.zoom
            };
            Usersessionstates.updateSession();
          }

          return deferred.promise;
        },
        map: {
          address: "",
          bounds: {
            northeast: {
              latitude: 0,
              longitude: 0
            },
            southwest: {
              latitude: 0,
              longitude: 0
            }
          },
          center: {
            "longitude": 8.01177978515625,
            "latitude": 45.12199086176226
          },
          standardCenter: {
            "longitude": 8.01177978515625,
            "latitude": 45.12199086176226
          },
          centerMarker: {
            title: 'Your current search location',
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
            bounds_changed: function (map) {
              debug("BOUNDS CHANGED EVENT");
              debug("NORTHEAST", map.getBounds().getNorthEast());
              debug("SOUTHWEST", map.getBounds().getSouthWest());

              // bounds contain northeast and southwest lat/lng which we will use to search activities within
              this.$parent.map.bounds = { // TODO what can we use instead of $parent?
                northeast: {
                  latitude: map.getBounds().getNorthEast().k,
                  longitude: map.getBounds().getNorthEast().A
                },
                southwest: {
                  latitude: map.getBounds().getSouthWest().k,
                  longitude: map.getBounds().getSouthWest().A
                }
              };

              Usersessionstates.states.bounds = {
                northeast: {
                  latitude: map.getBounds().getNorthEast().k,
                  longitude: map.getBounds().getNorthEast().A
                },
                southwest: {
                  latitude: map.getBounds().getSouthWest().k,
                  longitude: map.getBounds().getSouthWest().A
                }
              };
              Usersessionstates.updateSession();

              $rootScope.$apply(function () {
                $rootScope.mapInstance = map;
              });
            },
            zoom_changed: function (map) {
              debug("ZOOM CHANGED EVENT", map.getZoom());
              // we are sure to have Usersessionstates.states after initializeMapWithUserSearchLocation()
              Usersessionstates.states.zoom = map.getZoom();
              Usersessionstates.updateSession();
            },
            center_changed: function (map) {
              debug("CENTER CHANGED", map.getCenter());
              // we are sure to have Usersessionstates.states.searchlocation.coords.latitude/longitude after initializeMapWithUserSearchLocation()
              Usersessionstates.states.searchlocation.coords.latitude = map.getCenter().k;
              Usersessionstates.states.searchlocation.coords.longitude = map.getCenter().A;
              Usersessionstates.updateSession();
            }
          }
        }
      };
    };

    return mapdata;
  });

