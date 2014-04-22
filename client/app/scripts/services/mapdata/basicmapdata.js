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

      var setMarkersWithoutBlinking = function (activities) {
        // we have here a mechanism to remove old activities from the map one by one
        // otherwise if we do just an assignment, there will be blinking in the map when we move it
        // this is really ugly but keeps the activities from blinking,
        // because we have no direct assignment like
        // map.markers = activities
        var markersToKeep = [];
        var newMarkers = [];
        // all activities must be in map
        _.each(activities, function (activity) {
          var keepThisMarker = _.filter(map.markers, function (existingMarker) {
            return activity._id === existingMarker._id;
          });

          if (keepThisMarker.length === 0) {
            newMarkers.push(activity);
          } else {
            markersToKeep = markersToKeep.concat(keepThisMarker);
          }
        });

        markersToKeep = markersToKeep.concat(newMarkers);
        map.markers = markersToKeep;

        // @TODO apply ? move to proper place
        $rootScope.$apply();
      };

      var geoCodeAddress = function (address) {

        var defer = $q.defer();

        if (!address) {
          defer.resolve("No address entered");
        } else {
          geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'address': address, 'region': 'it' }, function (results, status) {

            debug("FOUND ADDRESS!", status, results);

            if (status === google.maps.GeocoderStatus.OK) {
              map.center.latitude = results[0].geometry.location.k;
              map.center.longitude = results[0].geometry.location.A;
              map.centerMarker.latitude = results[0].geometry.location.k;
              map.centerMarker.longitude = results[0].geometry.location.A;
              map.address = address;
              map.zoom = config.locationsearch.zoom;

              $rootScope.$apply();

              console.log("AM DONE GEOCODING ADDRESS");
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

      var setMarkerOnMap = function (marker) {
        map.markers = [];
        map.markers.push(marker);
      };

      // find activities according to date that the user entered
      // there may be a start date and an end date or only one of them or none
      // find only activities that are within a northeast and southwest lat/lng
      var findActivitiesForDateRangeAndBetweenBounds = function (start, end) {
        var defer = Q.defer();

        // if user selected a start date, set time to 00:00:00 so day is complete
        if (start) {
          start.setHours(0);
          start.setMinutes(0);
          start.setSeconds(0);
        } else {
          // if we have no start date, use now
          // if we have no end date, use one year later than now
          // will be initialized with current time
          start = new Date();
        }

        if (!end) {
          var oneYearLater = new Date();
          oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
          end = oneYearLater;
        }
        // set time so that the end date day is complete
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        debug("SEARCHING FOR NORTHEAST", map.bounds.northeast.latitude, map.bounds.northeast.longitude);
        debug("SEARCHING FOR SOUTHWEST", map.bounds.southwest.latitude, map.bounds.southwest.longitude);
        debug("SEARCHING FOR DATE", start, end);

        models.ActivityModel.filteredActivities({
          from: {  //  <bottom left coordinates>   southwest
            lng: map.bounds.southwest.longitude,
            lat: map.bounds.southwest.latitude
          },
          to: {  //  <upper right coordinates>    northeast
            lng: map.bounds.northeast.longitude,
            lat: map.bounds.northeast.latitude
          },
          startDate: start,
          endDate: end
        })
          .then(function (activities) {
            debug("GOT DATE FILTERED ACTIVITIES", activities.length, activities);
            defer.resolve(activities);
          })
          .fail(function (err) {
            debug("Error in date filtering", err);
            defer.reject();
          })
          .done();

        return defer.promise;
      };

      var updateActivitiesInMapHandler = function (googleMap) {
        debug("IDLE EVENT", googleMap.getCenter());

        // bounds contain northeast and southwest lat/lng which we will use to search activities within
        map.bounds = {
          northeast: {
            latitude: googleMap.getBounds().getNorthEast().k,
            longitude: googleMap.getBounds().getNorthEast().A
          },
          southwest: {
            latitude: googleMap.getBounds().getSouthWest().k,
            longitude: googleMap.getBounds().getSouthWest().A
          }
        };

        Usersessionstates.states.bounds = {
          northeast: {
            latitude: googleMap.getBounds().getNorthEast().k,
            longitude: googleMap.getBounds().getNorthEast().A
          },
          southwest: {
            latitude: googleMap.getBounds().getSouthWest().k,
            longitude: googleMap.getBounds().getSouthWest().A
          }
        };

        Usersessionstates.states.searchlocation.coords.latitude = googleMap.getCenter().k;
        Usersessionstates.states.searchlocation.coords.longitude = googleMap.getCenter().A;
        Usersessionstates.states.zoom = googleMap.getZoom();
        Usersessionstates.updateSession();

        // update activities

        // look for activities within these bounds and in a date range from now until one year later
        findActivitiesForDateRangeAndBetweenBounds()
          .then(function (activities) {
            setMarkersWithoutBlinking(activities);
          })
          .catch(function (err) {
            debug("Something went wrong while searching activities", err);
          });
      };

      // standard configs for the map, for trying out
      var config = {
        locationsearch: {
          zoom: 9
        },
        maxzoomout: {
          zoom: 4
        }
      };

      var map = {
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
          idle: updateActivitiesInMapHandler
        }
      };

      return {

        // user enters a location and/or a start date and/or an end date, each of these is optional
        // first address is geocoded and set to map
        // then map center is updated
        // then map bounds are updated
        // now search for activities with date range and bounds

        updateSearch: function () {

        },

        searchActivities: function (startDate, endDate, address) {
          debug("SEARCHING START DATE ", startDate, "END DATE ", endDate, " ADDRESS ", address);

          geoCodeAddress(address)
            .catch(function (err) {
              debug("Something went wrong while searching address", err);
            });

          // activites aktualisieren

        },

        findAddressOnMap: function (marker) {
          if (!marker.address) {
            debug("FOUND NO ADDRESS");
          } else {
            geoCodeAddress(marker.address)
              .then(function () {
                debug("DONE GEOCODING ADDRESS");     // TODO set marker on map
                setMarkerOnMap(marker);
                $rootScope.$broadcast("EditMapChangeEvent");
              })
              .catch(function (err) {
                debug("Something went wrong while searching address", err);
              });
          }
        },

        findAddressForCoordinates: function (latitude, longitude) {
          debug("LOOKING FOR ADDRESS FOR", latitude, longitude);

          var latlng = new google.maps.LatLng(latitude, longitude);

          geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            debug("CODED RESULTS", results, status);
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                debug("SET ADDRESS TO MAP", results[1]);
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

        initializeMapWithUserSearchLocation: function () {
          var deferred = Q.defer();

          map.markers = [];

          // dont update Usersessionstates here, it will overwrite stuff !!!
          function setInitPositionOnMap(position) {
            map.centerMarker.latitude = position.coords.latitude;
            map.centerMarker.longitude = position.coords.longitude;
            map.center.latitude = position.coords.latitude;
            map.center.longitude = position.coords.longitude;
          }

          Usersessionstates.loadSession();

          // if there are session stored, check what is stored and fill into map
          if ((Usersessionstates && Usersessionstates.states && Usersessionstates.states.searchlocation && Usersessionstates.states.searchlocation.coords) || !navigator.geolocation) {
            debug("Got Usersessionstates, will set position");
            setInitPositionOnMap(Usersessionstates.states.searchlocation);

            if (Usersessionstates.states.zoom) {
              map.zoom = Usersessionstates.states.zoom;
            }

            return Q.resolve(map); // TODO why deferred is not working here???

          } else {
            // try to get user's position
            // it works --> map is filled with new data, set that data to Usersessionstates
            // it fails --> map is filled with standard data, set that data to Usersessionstates
            // update Usersessionstates
            debug("Got Nothing, will determine browser postion and set");
            navigator.geolocation.getCurrentPosition(function (position) {
              setInitPositionOnMap(position);
              debug("do we have bounds", map.bounds.northeast);
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
              debug("RESOLVE WITH BROWSER STATE CHECKED");
              return deferred.resolve(map);

            }, function (err) {
              debug("Could not set initial location, will initialize with default Torino", err);
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
              debug("RESOLVE AFTER BROWSER STATE ERR");
              return deferred.resolve(map);
            });

          }
          return deferred.promise;
        },
        map: map
      };

    };

    return mapdata;
  }
);

