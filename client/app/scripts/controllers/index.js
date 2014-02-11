'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, /*currentUser,*/ $window) {

    $scope.activities = resolvedActivities;
//    $scope.currentUser = currentUser;

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

    $scope.states.categories = {
      sports: [],
      culture: [],
      wellness: []
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

    // TODO what is that for?
    $scope.onlySelected = function (activity) {
      if (activity.see) {
        return false;
      } else {
        return true;
      }
    };

    $scope.toggleCategorySelection = function (category) {
      category.selected = !category.selected;
    };

    var selectAllSubCategories = function (mainCat, selectIt) {
      angular.forEach($scope.states.categories[mainCat], function (category) {
        category.selected = selectIt;
      });
    };

    $scope.selectAllCategories = function (selectAll) {
      selectAllSubCategories("sports", selectAll);
      selectAllSubCategories("culture", selectAll);
      selectAllSubCategories("wellness", selectAll);
    };

    // start by selecting all
    $scope.selectAllCategories(true);

    // if there is no category that is not selected, then all categories are selected
    $scope.allSelectedFromCategory = function (mainCat) {
      return (_.where($scope.states.categories[mainCat], { 'selected': false }).length > 0) ? false : true;
    };

    // if there is no category that is selected, then all categories are deselected
    $scope.noneSelectedFromCategory = function (mainCat) {
      return (_.where($scope.states.categories[mainCat], { 'selected': true }).length > 0) ? false : true;
    };

    $scope.allSelected = function () {
      return ($scope.allSelectedFromCategory('sports') && $scope.allSelectedFromCategory('culture') && $scope.allSelectedFromCategory('wellness'));
    };

    $scope.noneSelected = function () {
      return ($scope.noneSelectedFromCategory('sports') && $scope.noneSelectedFromCategory('culture') && $scope.noneSelectedFromCategory('wellness'));
    };

    $scope.getMarkerIcon = function (activity) {
      return "/img/mapicons/marker-" + activity.category + ".svg";
    };

    $scope.areItemsInThisCategorySelected = function (mainCat) {
      if (_.where($scope.states.categories[mainCat], { 'selected': true }).length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.selectAllFromCategory = function (mainCat) {
      angular.forEach($scope.states.categories[mainCat], function (category) {
        category.selected = true;
      });
    };

    $scope.deSelectAllFromCategory = function (mainCat) {
      angular.forEach($scope.states.categories[mainCat], function (category) {
        category.selected = false;
      });
    };

    $scope.numberOfSelectedFromCategory = function (mainCat) {
      return _.where($scope.states.categories[mainCat], { 'selected': true }).length;
    };

    $scope.totalNumberOfCategory = function (mainCat) {
      return filterActivitiesByMainCategory(mainCat).length;
    };

    var categoryNames = {
//      "sports": {
      "adventure": "Adventure",
      "yoga": "Yoga & Pilates",
      "water": "Water Sports",
      "extreme": "Extreme Sports",
      "trekking": "Trekking, Biking, Hiking",
      "fullday": "Full day activities",
      "winter": "Winter Sports",
      "motor": "Motorized Sports",
//      },
//      "culture": {
      "degustation": "Degustations: Wine & Food & Cigars",
      "exhibition": "Exhibitions & Fairs",
      "music_film": "Music & Film",
      "guided_tour": "Guided Tours",
      "opera_theater": "Opera & Theater",
//      },
//      "wellness": {
      "massage": "Massages",
      "beauty": "Beauty",
      "medical": "Medical Treatments",
      "spa_sauna": "SPA & Sauna"
//      }
    };

    function filterActivitiesByMainCategory(mainCatName) {
      return _.filter(resolvedActivities, function (activity) {
        return activity.category.main === mainCatName;
      });
    }

    function findSubcategories(mainCat, activities) {
      var groupBy = _.groupBy(activities, function (activity) {
        return activity.category.sub;
      });

      _.forEach(Object.keys(groupBy), function (key) {
        if (categoryNames[key].length > 0) {
          $scope.states.categories[mainCat].push({
            name: categoryNames[key],
            key: key,
            selected: true
          });
        }
      });
      return $scope.states.categories[mainCat];
    }

    $scope.sportsCategories = findSubcategories("sports", filterActivitiesByMainCategory("sports"));
    $scope.cultureCategories = findSubcategories("culture", filterActivitiesByMainCategory("culture"));
    $scope.wellnessCategories = findSubcategories("wellness", filterActivitiesByMainCategory("wellness"));

  });

// TODO komisches Verhalten von "Select All" und "Deselect All" Wann wollen wir was darstellen?