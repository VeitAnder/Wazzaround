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

        // find activities according to date that the user entered
        // there may be a start date and an end date or only one of them or none
        // find only activities that are within a northeast and southwest lat/lng
        var findActivitiesForDateRangeAndBetweenBounds = function (map, start, end) {
          var defer = Q.defer();

          // if we have no start date, use now
          // if we have no end date, use
//        if (!start) {
//          start = new Date();
//        }
//        if (!end) {
//          var oneYearLater = new Date();
//          oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
//          end = oneYearLater;
//        }

          debug("SEARCHING FOR NORTHEAST", map.bounds.northeast.latitude, map.bounds.northeast.longitude);
          debug("SEARCHING FOR SOUTHWEST", map.bounds.southwest.latitude, map.bounds.southwest.longitude);

          models.ActivityModel.filteredActivities({
            from: {  // links oben = northeast
              longitude: map.bounds.northeast.longitude,
              latitude: map.bounds.northeast.latitude
            },
            to: {  // rechts unten = southwest
              longitude: map.bounds.southwest.longitude,
              latitude: map.bounds.southwest.latitude
            }
//            ,
//            startDate: start,
//            endDate: end
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
            debug("INIT ACTIVITIES");
          },
          searchActivities: function (map, startDate, endDate, address) {
            debug("SEARCHING START", startDate, "END ", endDate, " ADDR ", address);

            findActivitiesForDateRangeAndBetweenBounds(map, startDate, endDate)
              .then(function () {
                return geoCodeAddress(map, address);
              })

              .then(function () {
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

            // dont update Usersessionstates here, it will overwrite stuff !!!
            function setInitPositionOnMap(position) {
              map.centerMarker.latitude = position.coords.latitude;
              map.centerMarker.longitude = position.coords.longitude;
              map.center.latitude = position.coords.latitude;
              map.center.longitude = position.coords.longitude;
            }

            function couldNotGetInitPosition(err) {
              debug("Could not set initial location, will initialize with default Torino", err);
            }

            Usersessionstates.loadSession();

            // if there are session stored, check what is stored and fill into map
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
            return Q.resolve(map);
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
                debug("BOUNDS CHANGED EVENT", "NE", map.getBounds().getNorthEast(), "SW", map.getBounds().getSouthWest());

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
      }
      ;

    return mapdata;
  })
;

