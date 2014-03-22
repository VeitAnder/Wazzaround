'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window, $rootScope, categories, frontendmap, $route) {

    $scope.currentUser = currentUser;

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

    $scope.map = frontendmap.map;
    frontendmap.showInitialActivities($scope.map, resolvedActivities);
    $scope.map.zoom = 9;

    $scope.windowOptions = {
      "zIndex": 1000
    };

    $scope.onMarkerClicked = function (markerClicked) {
      debug("Marker: lat: " + markerClicked.latitude + ", lon: " + markerClicked.longitude + " clicked!!");
      _.each($scope.map.markers, function (marker) {
        if (marker._id === markerClicked._id) {
          markerClicked.showWindow = true;
        } else {
          marker.showWindow = false;
        }
      });
    };

    $scope.onlySelectedCategories = function (activity) {
      if (!activity.category.main) {   // TODO this occurs because in edit mode it is allowed to save without selecting a category
        return false;
      }
      // array of activity subcats
      // array of subcats from categories
      // in array of subcats from categories, subcat has to be selected===true and also has to equal at least one subcat from activity subcat array
      var filteredActivities = [];
      _.each(activity.category.subs, function (subCatInActivity) {
        _.each($scope.getMainCategory(activity.category.main).sub, function (subCatFromCategories) {
          if (subCatInActivity.key === subCatFromCategories.key && subCatFromCategories.selected === true) {
            filteredActivities.push(subCatFromCategories);
          }
        });
      });
      return filteredActivities.length > 0;
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
      var catsInActs = [];
      angular.forEach($scope.map.markers, function (activity) {
        if (activity.category.main === mainCat) {
          _.each(activity.category.subs, function (subCatInActivity) {

            _.each($scope.getMainCategory(mainCat).sub, function (subCatInCategories) {
              if (subCatInCategories.key === subCatInActivity.key) {
                catsInActs.push(subCatInCategories.key);
              }
            });
          });
        }
      });
      return _.uniq(catsInActs);
    }

    $scope.numberOfSelectedFromCategory = function (mainCat) {
      var catsInActs = categoriesInActivities(mainCat);
      var countSelected = 0;
      angular.forEach($scope.getMainCategory(mainCat).sub, function (subCat) {
        if (_.contains(catsInActs, subCat.key)) {
          if (subCat.selected === true) {
            countSelected++;
          }
        } else {
          subCat.selected = false;  // DIRTY HACK
        }
      });
      return countSelected;
    };

    // first time coming here, all the categories are selected
    // after a search:
    // we find some activities and search for those with the right main category
    // only the sub-categories of that activities should be selected and counted
    function setSelected(mainCat) {
      var filteredSubCats = categoriesInActivities(mainCat);
      angular.forEach($scope.getMainCategory(mainCat).sub, function (subCat) {
        if (_.contains(filteredSubCats, subCat.key)) {
          subCat.selected = true;
        } else {
          subCat.selected = false;
        }
      });
    }

    // this is the fixed number of categories contained in activities, no matter if selected or not
    $scope.totalNumberOfCategory = function (mainCat) {
      return categoriesInActivities(mainCat).length;
    };

    $scope.getAddress = frontendmap.getAddress;

    // every activity has bookableItems, like Quadfahren
    // this bookableItem Quadfahren has events, like 1.3. Quadfahren, 2.3. Quadfahren, 3.3. Quadfahren
    // sort these events by date and save 3 to be displayed when user klicks on activity in index page
    $scope.getNextAvailableEvents = function () {

      if ($scope.map.markers.length > 0) {

        _.each($scope.map.markers, function (marker) {
          var events = [];

          _.each(marker.bookableItems, function (bookableItem) {
            _.each(bookableItem.ref().events, function (event) {
              event.ref().title = {
                en: bookableItem.ref().description.en,
                de: bookableItem.ref().description.de,
                it: bookableItem.ref().description.it
              };
              events.push(event.ref());
            });
          });
          events = _.sortBy(events, "start");
          events = events.slice(0, 3);
          marker.availability = _.clone(events);
        });
      }

    };
    $scope.getNextAvailableEvents();

    $scope.putIntoShoppingCart = function(activity, event) {
      debug("Put into shopping cart", activity, event);
    };

    $rootScope.$on("MapChangeEvent", function (event, message) {
      debug("MAP CHANGED !!! MARKERS: ", $scope.map.markers);
      angular.forEach($scope.categories, function (mainCat) {
        setSelected(mainCat.key);
      });
    });

    // when user changes language, reload controller so that all translations are correct
    $rootScope.$on('$translateChangeSuccess', function () {
      $route.reload();
    });

  });
