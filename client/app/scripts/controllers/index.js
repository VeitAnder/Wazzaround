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


    $scope.windowOptions = {
      "zIndex": 1000
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
    $scope.sportsCategories = { db: $scope.getMainCategory('sports').sub };
    $scope.cultureCategories = { db: $scope.getMainCategory('culture').sub };
    $scope.wellnessCategories = { db: $scope.getMainCategory('wellness').sub };

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

    // find all categories that are in the activities we get from the map
    function categoriesInActivities(mainCat) {
//      debug("CATS IN ACTS READING MARKERS", $scope.map.markers.length); correct
      var catsInActs = [];
      angular.forEach($scope.map.markers, function (activity) {
//        debug("ONE ACTIVITY IN MARKERS", activity);  correct
        if (activity.category.main === mainCat) {
//          debug("IS SAME AS MAINCAT");
//          angular.forEach($scope.getMainCategory(mainCat).sub, function(subCat) {
//            debug("GOT SUBCAT", subCat);
//            debug("KEY IS SAME?", subCat.key, activity.category.sub, subCat.key === activity.category.sub);
//            debug("CHECK CONTAINS", _.contains($scope.getMainCategory(mainCat).sub, { 'key' : activity.category.sub }));
//          });

          if (_.where($scope.getMainCategory(mainCat).sub, { 'key' : activity.category.sub }).length > 0) {
            catsInActs.push(activity.category.sub);
          }
        }
      });
      return _.uniq(catsInActs);
    }

    // first time coming here, all the categories are selected
    // after a search:
    // we find some activities and search for those with the right main category
    // only the sub-categories of that activities should be selected

    // ATTENTION: this is called after toggleSelected, so dont set any selected here, will overwrite what user does in UI!
    $scope.numberOfSelectedFromCategory = function (mainCat) {
      var catsInActs = categoriesInActivities(mainCat);
      debug("NOW WE HAVE", catsInActs.length);
      var countSelected = 0;
      // TODO: what we set here as selected will not be updated in view !!!
      angular.forEach($scope.getMainCategory(mainCat).sub, function (category) {
        if (_.contains(catsInActs, category.key)) {
//          debug("CATS IN ACTS CONTAINS", catsInActs, category.key);
          if(category.selected === true) {
            countSelected++;
          }
        } else {
          category.selected = false;  // will set to false in UI and not allow to click
        }
      });
      return countSelected;
    };

    // this is the fixed number of categories contained in activities, no matter if selected or not
    $scope.totalNumberOfCategory = function (mainCat) {
      return categoriesInActivities(mainCat).length;
    };

    $rootScope.$on("MapChangeEvent", function (event, message) {
      debug("MAP CHANGED !!! MARKERS: ", $scope.map.markers);
      // @TODO new categories from server
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
