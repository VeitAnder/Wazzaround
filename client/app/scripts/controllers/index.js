'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window, mapdataservice, $rootScope, categories) {

    $scope.currentUser = currentUser;

    debug("resolvedactivities", resolvedActivities);

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

    $scope.categories = categories;

    var initStatesCategories = function () {
      angular.forEach($scope.categories, function (category) {
        angular.forEach(category.sub, function (sub) {
          sub.selected = true;
        });
      });
    };
    initStatesCategories();


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

    $scope.map = mapdataservice.map;
    $scope.map.markers = resolvedActivities;
    $scope.map.events = {
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
    };

    $scope.onMarkerClicked = function (marker) {
      debug("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!");
      marker.showWindow = true;
    };

    // filter activities so that only if their sub category is selected, they are displayed
    $scope.onlySelectedCategories = function (activity) {
      return _.where($scope.getMainCategory(activity.category.main).sub, { 'key': activity.category.sub, 'selected': true }).length === 1 ? true : false;
    };

    $scope.toggleCategorySelection = function (category) {
      category.selected = !category.selected;
    };

    $scope.selectAllCategories = function () {
      angular.forEach($scope.categories, function (category) {
        angular.forEach(category.sub, function (sub) {
          sub.selected = true;
        });
      });
    };

    $scope.deSelectAllCategories = function () {
      angular.forEach($scope.categories, function (category) {
        angular.forEach(category.sub, function (sub) {
          sub.selected = false;
        });
      });
    };

    $scope.getMainCategory = function (maincategory) {
      return _.find($scope.categories, { 'key': maincategory });
    };

    $scope.sportsCategories = $scope.getMainCategory('sports').sub;
    $scope.cultureCategories = $scope.getMainCategory('culture').sub;
    $scope.wellnessCategories = $scope.getMainCategory('wellness').sub;

    // start by selecting all
    $scope.selectAllCategories(true);

    // if there is no category that is not selected, then all categories are selected
    $scope.allSelectedFromCategory = function (mainCat) {
      return (_.where($scope.getMainCategory(mainCat).sub, { 'selected': false }).length > 0) ? false : true;
    };

    // if there is no category that is selected, then all categories are deselected
    $scope.noneSelectedFromCategory = function (mainCat) {
      return (_.where($scope.getMainCategory(mainCat).sub, { 'selected': true }).length > 0) ? false : true;
    };

    $scope.allSelected = function () {
      return ($scope.allSelectedFromCategory('sports') && $scope.allSelectedFromCategory('culture') && $scope.allSelectedFromCategory('wellness'));
    };

    $scope.noneSelected = function () {
      return ($scope.noneSelectedFromCategory('sports') && $scope.noneSelectedFromCategory('culture') && $scope.noneSelectedFromCategory('wellness'));
    };

    $scope.getMarkerIcon = function (activity) {
      return "/img/mapicons/marker-" + activity.category.main + ".svg";
    };

    $scope.areItemsInThisCategorySelected = function (mainCat) {
      if (_.where($scope.getMainCategory(mainCat).sub, { 'selected': true }).length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.selectAllFromCategory = function (mainCat) {
      angular.forEach($scope.getMainCategory(mainCat).sub, function (category) {
        category.selected = true;
      });
    };

    $scope.deSelectAllFromCategory = function (mainCat) {
      angular.forEach($scope.getMainCategory(mainCat).sub, function (category) {
        category.selected = false;
      });
    };

    $scope.numberOfSelectedFromCategory = function (mainCat) {
      return _.where($scope.getMainCategory(mainCat).sub, { 'selected': true }).length;
    };

    $scope.totalNumberOfCategory = function (mainCat) {
      return filterActivitiesByMainCategory(mainCat).length;
    };

    function filterActivitiesByMainCategory(mainCatName) {
      return _.filter($scope.map.markers, function (marker) {
        return marker.category.main === mainCatName;
      });
    }

    $rootScope.$on("MapChangeEvent", function (event, message) {
      console.log("MAP CHANGED !!! MARKERS: ", $scope.map.markers);
      // @TODO new categories from server
//      fillUICategories();
      var e = {
        latLng: {
          lat: function () {
            return $scope.map.center.latitude;
          },
          lng: function () {
            return $scope.map.center.longitude;
          }
        }
      };
      $scope.map.events.click("", "mapserviceclick", [e]);
    });

  });
