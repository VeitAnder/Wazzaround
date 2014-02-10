'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window) {

    $scope.activities = resolvedActivities;
    $scope.currentUser = currentUser;

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
      item.selected = !item.selected;
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

    // TODO check number of selected
    $scope.numberOfSelectedFromCategory = function (category) {
      return _.where(filterActivitiesByMainCategory(category), { 'selected': true }).length;
    };

    $scope.totalNumberOfCategory = function (category) {
      return filterActivitiesByMainCategory(category).length;
    };

    var categoryNames = {
      // sports
      "adventure": "Adventure",
      "yoga": "Yoga & Pilates",
      "water": "Water Sports",
      "extreme": "Extreme Sports",
      "trekking": "Trekking, Biking, Hiking",
      "fullday": "Full day activities",
      "winter": "Winter Sports",
      "motor": "Motorized Sports",
      // culture
      "degustation": "Degustations: Wine & Food & Cigars",
      "exhibition": "Exhibitions & Fairs",
      "music_film": "Music & Film",
      "guided_tour": "Guided Tours",
      "opera": "Opera & Theater",
      // wellness
      "massage": "Massages",
      "beauty": "Beauty",
      "medical": "Medical Treatments",
      "spa_sauna": "SPA & Sauna"
    };

    function filterActivitiesByMainCategory(mainCatName) {
      return _.filter(resolvedActivities, function (activity) {
        if (activity.hidden === false) {
          return activity.category.main === mainCatName;
        }
      });
    }

    function findSubcategories(activities) {
      var groupBy = _.groupBy(activities, function (activity) {
        if (activity.hidden === false) {
          return activity.category.sub;
        }
      });
      var arr = [];
      _.forEach(Object.keys(groupBy), function (key) {
        if (categoryNames[key].length > 0) {
          arr.push({
            name: categoryNames[key],
            key: key,
            selected: true
          });
        }
      });
      return arr;
    }

    $scope.sportsCategories = findSubcategories(filterActivitiesByMainCategory("sports"));
    $scope.cultureCategories = findSubcategories(filterActivitiesByMainCategory("culture"));
    $scope.wellnessCategories = findSubcategories(filterActivitiesByMainCategory("wellness"));

  });

