'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 http://stackoverflow.com/questions/13619837/angular-js-inject-new-instance-of-class
 */
angular.module('anorakApp')
  .factory('basicmapdata', function ($rootScope, models, $q, $http, Usersessionstates, $timeout) {

    var mapdata = function () {
      var geocoder;

      var setMarkers = function (activities) {
        $timeout(function () {
          map.markers = activities;
        });
      };

      var setMapCenter = function (position) {
        map.center.latitude = position.coords.latitude;
        map.center.longitude = position.coords.longitude;
      };

      this.geoCodeAddress = function (address) {
        var defer = $q.defer();
        if (!address) {
          defer.resolve(null);
        } else {
          geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'address': address, 'region': 'it' }, function (results, status) {
            debug("FOUND ADDRESS!", status, results);
            if (status === google.maps.GeocoderStatus.OK) {
              debug("AM DONE GEOCODING ADDRESS");
              return defer.resolve(results[0].geometry.location);
            } else {
              debug("Status not OK!, failing", status);
              defer.reject("Could not geocode address", status);
            }
          });
        }
        return defer.promise;
      };

      // if end date is before start date, set to 1h after start date
      var setEndDateDependingOnStartDate = function() {
        var start = moment(map.searchStartDate);
        var end = moment(map.searchEndDate);

        if(start.isAfter(end)) {
          end = moment(start).add('weeks', 4);
          map.searchEndDate = end.toDate();
        }
      };

      var setTimeOnStartAndEndDate = function () {
        // if startdate is today, set current time, otherwise start at 00:00:00
        var start = moment(map.searchStartDate);
        var now = moment();
        var diff = start.diff(now, 'days', true);
        var round = Math.round(diff);

        // the date is today, if the difference in days is smaller than 1
        // in this case set current time
        // if its not today but later, start at 00:00:00
        if (round < 1) {
          map.searchStartDate.setHours(now.hours());
          map.searchStartDate.setMinutes(now.minutes());
          map.searchStartDate.setSeconds(now.seconds());
        } else {
          map.searchStartDate.setHours(0);
          map.searchStartDate.setMinutes(0);
          map.searchStartDate.setSeconds(0);
        }

        // on end date, set last possible time so that the day is completely covered
        map.searchEndDate.setHours(23);
        map.searchEndDate.setMinutes(59);
        map.searchEndDate.setSeconds(59);
      };

      // find activities according to date that the user entered
      // there may be a start date and an end date or only one of them or none
      // find only activities that are within a northeast and southwest lat/lng
      var findActivities = function () {
        debug("SEARCHING FOR NORTHEAST", map.bounds.northeast.latitude, map.bounds.northeast.longitude);
        debug("SEARCHING FOR SOUTHWEST", map.bounds.southwest.latitude, map.bounds.southwest.longitude);
        debug("SEARCHING FOR DATE", map.searchStartDate, map.searchEndDate);

        // @TODO for Jonathan - abort filteredActivities request if new one is fired!
        return models.ActivityModel.filteredActivities({
          from: {  //  <bottom left coordinates>   southwest
            lng: map.bounds.southwest.longitude,
            lat: map.bounds.southwest.latitude
          },
          to: {  //  <upper right coordinates>    northeast
            lng: map.bounds.northeast.longitude,
            lat: map.bounds.northeast.latitude
          },
          startDate: map.searchStartDate,
          endDate: map.searchEndDate
        })
          .then(function (activities) {
            debug("GOT DATE FILTERED ACTIVITIES", activities.length, activities);
            return activities;
          });
      };

      var onMapChange = function (googleMap) {
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

        saveMapStateToUsersession();

        // look for activities within these bounds and in a date range from now until one year later
        findActivities()
          .then(function (activities) {
            setMarkers(activities);
          })
          .catch(function (err) {
            debug("Something went wrong while searching activities", err);
          });
      };

      var saveMapStateToUsersession = function () {
        Usersessionstates.states.bounds = map.bounds;
        Usersessionstates.states.searchlocation = {
          coords: map.center
        };
        Usersessionstates.states.zoom = map.zoom;
        Usersessionstates.states.address = map.searchAddress;
        Usersessionstates.updateSession();
      };

      this.onSearchAddressChange = function () {
        console.log("search address changed");

        setTimeOnStartAndEndDate();

        this.geoCodeAddress(map.searchAddress)
          .then(function (coords) {
            if (coords !== null) {
              console.log("CENTER MARKER AFTER SEARCH CHANGE", map.searchAddress);
              map.center.latitude = coords.k;
              map.center.longitude = coords.A;
              map.centerMarker.latitude = coords.k;
              map.centerMarker.longitude = coords.A;
              map.zoom = config.locationsearch.zoom;

              saveMapStateToUsersession();
            }
            return findActivities();
          })
          .then(function (activities) {
            setMarkers(activities);
          })
          .catch(function (err) {
            debug("Something went wrong while searching activities", err);
          });
      };

      this.onSearchDateChange = function () {
        console.log("search date changed");

        setEndDateDependingOnStartDate();
        setTimeOnStartAndEndDate();

        findActivities()
          .then(function (activities) {
            setMarkers(activities);
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
        searchAddress: "",
        searchStartDate: new Date(),
        searchEndDate: moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay(), 23, 59, 59)).add('month', 6).toDate(),
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
          idle: onMapChange
        }
      };

      this.map = map;

      var findAddressForCoordinates = function (latitude, longitude) {

        var deferred = Q.defer();
        debug("LOOKING FOR ADDRESS FOR", latitude, longitude);

        var latlng = new google.maps.LatLng(latitude, longitude);

        geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              debug("GOT ADDRESS FROM COORDS", results[1]);
              deferred.resolve(results[1].formatted_address);
            } else {
              debug('No address found for coordinates');
              deferred.resolve(null);
            }
          }
        });
        return deferred.promise;
      };

      this.findAddressForCoordinates = findAddressForCoordinates;

      this.getGoogleAddressAutoCompletionList = function (viewValue) {
        var params = {address: viewValue, sensor: false, language: 'en'};
        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', { params: params })
          .then(function (res) {
            return res.data.results;
          });
      };

      this.initializeMapWithUserSearchLocation = function () {
        map.markers = [];

        setTimeOnStartAndEndDate();

        Usersessionstates.loadSession();

        // if there are session stored, check what is stored and fill into map
        if ((Usersessionstates.states.searchlocation && Usersessionstates.states.searchlocation.coords) || !navigator.geolocation) {
          debug("Got Usersessionstates, will set position");

          if (Usersessionstates.states.zoom) {
            map.zoom = Usersessionstates.states.zoom;
          }

          if (Usersessionstates.states.address) {
            map.searchAddress = Usersessionstates.states.address;
            this.geoCodeAddress(map.searchAddress)
              .then(function (coords) {
                if (coords !== null) {
                  var position = {
                    coords: {
                      latitude: coords.k,
                      longitude: coords.A
                    }
                  };
                  setMapCenter(position);
                  map.centerMarker.latitude = coords.k;
                  map.centerMarker.longitude = coords.A;
                }
                return Q.resolve(map);
              });
          } else {
            setMapCenter(Usersessionstates.states.searchlocation);
            return Q.resolve(map);
          }

        } else {
          var deferred = Q.defer();
          // try to get user's position
          // it works --> map is filled with new data, set that data to Usersessionstates
          // it fails --> map is filled with standard data, set that data to Usersessionstates
          // update Usersessionstates
          debug("Got Nothing, will determine browser postion and set");
          navigator.geolocation.getCurrentPosition(function (position) {
            setMapCenter(position);

            findAddressForCoordinates(position.coords.latitude, position.coords.longitude)
              .then(function (address) {
                if (address !== null) {
                  map.searchAddress = address;
                  map.centerMarker.latitude = position.coords.latitude;
                  map.centerMarker.longitude = position.coords.longitude;
                }
                saveMapStateToUsersession();
                return deferred.resolve(map);
              });

          }, function (err) {
            debug("Could not set initial location, will initialize with default Torino", err);
            saveMapStateToUsersession();
            map.centerMarker.latitude = map.center.latitude;
            map.centerMarker.longitude = map.center.longitude;
            return deferred.resolve(map);
          });
          return deferred.promise;
        }
      };

      this.getMarkerIcon = function (maincategorykey) {
        if (maincategorykey) {
          return "/img/mapicons/marker-" + maincategorykey + ".png";
        } else {
          return "/img/mapicons/marker.png";
        }
      };

      this.getMarkerIconActive = function (maincategorykey) {
        if (maincategorykey) {
          return "/img/mapicons/marker-" + maincategorykey + "-active.png";
        } else {
          return "/img/mapicons/marker.png";
        }
      };

      this.getCurrentSearchLocation = function () {
        return {
          lng: this.map.centerMarker.longitude,
          lat: this.map.centerMarker.latitude
        };
      };

    };

    return mapdata;
  });