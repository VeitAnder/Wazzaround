'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, $window) {

    $scope.activities = resolvedActivities;

    debug("resolvedactivities", resolvedActivities);

    //$scope.windowheight = ($window.innerHeight - 100)Activities + "px";

    $scope.states = {
      sports: {
        open: false
      },
      culture: {
        open: false
      },
      wellness: {
        open: false
      }
    };

    $scope.toggleFilter = function (category) {
      if ($scope.states[category].open) {
        $scope.states[category].open = false;
      } else {
        angular.forEach($scope.states, function (item) {
          item.open = false;
        });
        $scope.states[category].open = true;
      }
    };

    $scope.map = {
      center: {
        "longitude": 8.01177978515625,
        "latitude": 45.12199086176226

      },
      zoom: 9,
      markers: $scope.activities,
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
      }
    };

    $scope.onMarkerClicked = function (marker) {
      debug("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!");
      marker.showWindow = true;
    };

    // filter activities
    $scope.onlySports = function (activity) {
      if (activity.category === "sports") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlyCulture = function (activity) {
      if (activity.category === "culture") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlyWellness = function (activity) {
      if (activity.category === "wellness") {
        return true;
      } else {
        return false;
      }
    };

    $scope.onlySelected = function (activity) {
      if (activity.hidden) {
        return false;
      } else {
        return true;
      }
    };

    $scope.toggleItemSelection = function (item) {
      item.hidden = !item.hidden;
    };

    $scope.selectAllCategories = function () {
      angular.forEach($scope.activities, function (activity) {
        activity.hidden = false;
      });
    };
    // start by selecting all
    $scope.selectAllCategories();

    $scope.deSelectAllCategories = function () {
      angular.forEach($scope.activities, function (activity) {
        activity.hidden = true;
      });
    };

    $scope.allSelected = function () {
      if (_.where($scope.activities, { 'hidden': true }).length > 0) {
        return false;
      } else {
        return true;
      }
    };

    $scope.noneSelected = function () {
      if (_.where($scope.activities, { 'hidden': false }).length > 0) {
        return false;
      } else {
        return true;
      }
    };

    $scope.getMarkerIcon = function (activity) {
      return "/img/mapicons/marker-" + activity.category + ".svg";
    };

    $scope.areItemsInThisCategorySelected = function (category) {
      if (_.where($scope.activities, { 'hidden': false, 'category': category }).length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.selectAllFromCategory = function (category) {
      angular.forEach(_.where($scope.activities, { 'category': category }), function (activity) {
        activity.hidden = false;
      });
    };

    $scope.deSelectAllFromCategory = function (category) {
      angular.forEach(_.where($scope.activities, { 'category': category }), function (activity) {
        activity.hidden = true;
      });
    };

    $scope.numberOfSelectedFromCategory = function (category) {
      return _.where($scope.activities, { 'category': category, 'hidden': false}).length;
    };

    $scope.totalNumberOfCategory = function (category) {
      return _.where($scope.activities, { 'category': category}).length;
    };

  });
