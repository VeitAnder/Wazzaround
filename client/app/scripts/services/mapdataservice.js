'use strict';

/* Service will
 - use here given coordinate to center map
 - locations entered by the user to find coordinates and center map
 - filter activities in a radius of 30km around this central coordinates
 */
angular.module('anorakApp')
  .service('mapdataservice', function mapdataservice($rootScope, models, $q) {

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

    var geoCodeAddress = function (address) {

      var defer = $q.defer();

      if (!address) {
        debug("GOT NO ADDRESS", address);
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
            mapdata.map.address = address; // TODO remove later, is only for controlling

            var markersInRadius = [];
            for (var i = 0; i < mapdata.map.markers.length; i++) {
              // calculate distance between center and the marker
              // if distance more than 30km, dont display
              // TODO later on filter activities(===markers) from db via lat-long range
              /////Activiews.use.find({...}).then(....)

              var distance = calculateDistance(mapdata.map.center.latitude, mapdata.map.center.longitude, mapdata.map.markers[i].latitude, mapdata.map.markers[i].longitude);
              if (distance < 30) {
                debug("DISTANCE FIT FOR MARKER");
                markersInRadius.push(mapdata.map.markers[i]);
              }
            }
            mapdata.map.markers = markersInRadius;
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

    var findActivitiesForDateRange = function (start, end) {

      // it's not a search for date, so just return
      if (!start && !end) {
        return;
      } else if (!start) {
        start = new Date();
      } else if (!end) {
        end = new Date(2099,1,1);
      }

      var startDate = moment(start);
      var endDate = moment(end);

      // filter activities for dates
      debug("GOT ACTIVITIES TO FILTER", mapdata.map.markers);
      var dateFilteredActivities = _.filter(mapdata.map.markers, function (activity) {

        var activityStart = moment(new Date(activity.availability[0].start));
        var activityEnd = moment(new Date(activity.availability[0].end));

        // activityStart is same or later than startDate AND activityEnd is same or before endDate, THEN it's in range
        function isOverlapping (s1, start, end) {
          if ( s1 >= start && s1 <= end ) {
            return true;
          }
          return false;
        }
        var overlaps = false;
        if ( activityStart >= startDate ) {
          overlaps = isOverlapping(activityStart, startDate, endDate);
        } else {
          overlaps = isOverlapping(startDate, activityStart, activityEnd);
        }
        return overlaps;

      });

      debug("GOT DATE FILTERED ACTIVITIES", dateFilteredActivities);
      mapdata.map.markers = dateFilteredActivities;
    };

    var mapdata = {
      searchActivities: function (startDate, endDate, address) {
        debug("SEARCHING START", startDate, "END ", endDate, " ADDR ", address);

        if (!startDate && !endDate && !address) {
          debug("FOUND NONE OF SERARCH STUFF");

          models.ActivityModel.use.all()

            .then(function (activities) {
              debug("GOT ACTS", activities);
              mapdata.map.markers = activities;
              $rootScope.$broadcast("MapChangeEvent");
            })
            .fail(function (err) {
              debug("Could not get all activities", err);
            })
            .done();

        } else {

          geoCodeAddress(address)
            .then(function () {

              findActivitiesForDateRange(startDate, endDate);
              debug("AM DONE SEARCHING IN SERVICE");
              $rootScope.$broadcast("MapChangeEvent");
            })

            .fail(function (err) {
              debug("Something went wrong while searching", err);
            })

            .done();
        }
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
        }
      }
    };

    return mapdata;
  })
;
