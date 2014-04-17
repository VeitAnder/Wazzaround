'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window, $rootScope, categories, frontendmap, $route, $translate, Usersessionstates) {

    $scope.currentUser = currentUser;

    $scope.states = {};

    // set initial state of category selection:
    // if states are stored, use these, otherwise select all and store locally
    var initStatesCategories = function () {

      // if the object is already initialized, app is already running, dont overwrite
      if (Object.keys($scope.states).length > 0) {
        return;
      }

      if (Usersessionstates.states && Usersessionstates.states.selectedcategories) {
        $scope.states = angular.copy(Usersessionstates.states.selectedcategories);
      }
      else {

        // initialize category selection: all main categories closed, all subcategories selected
        _.each(categories, function (mainCat) {
          $scope.states[mainCat.key] = {
            open: false,
            sub: angular.copy(mainCat.sub),
            key: mainCat.key
          };
          _.each($scope.states[mainCat.key].sub, function (subCat) {
            subCat.selected = true;
            subCat.wasselected = true;
          });
        });

        Usersessionstates.states.selectedcategories = angular.copy($scope.states);
        Usersessionstates.updateSession();
      }
    };
    initStatesCategories();

    var selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory = function () {
      console.log("SELECT ALL THAT HAVE BEEN SELECTED IN ACTIVE");
      _.each($scope.states, function (mainCat) {
        var catsInActs = categoriesInActivities(mainCat.key);

        angular.forEach($scope.states[mainCat.key].sub, function (subCat) {
          if (_.contains(catsInActs, subCat.key) && mainCat.open === true) {
            if (subCat.wasselected === true) {
              subCat.selected = true;
            }
          } else {
            subCat.selected = false;
          }
        });
      });
    };

    // user clicks on main category box
    // this box opens, all other boxes close
    // all subcategories in this box will be selected if there are activities for them
    $scope.toggleFilter = function (category) {
      if ($scope.states[category].open) {
        $scope.states[category].open = false;
      } else {

        angular.forEach($scope.states, function (mainCat) {
          if (category === mainCat.key) {
            mainCat.open = true;
          } else {
            mainCat.open = false;
          }
        });

        selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory();
      }

      Usersessionstates.states.categoryfilter = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.map = frontendmap.map;

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
      // in array of subcats from categories, category has to occur in activity subcats and has to be selected
      var filteredActivities = [];
      _.each(activity.category.subs, function (subCatInActivity) {
        _.each($scope.states[activity.category.main].sub, function (subCatFromCategories) {
          if (subCatInActivity.key === subCatFromCategories.key && subCatFromCategories.selected === true) {
            filteredActivities.push(subCatFromCategories);
          }
        });
      });
      return filteredActivities.length > 0;
    };

    $scope.toggleCategorySelection = function (category) {
      category.selected = !category.selected;
      category.wasselected = category.selected;

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.selectAllCategories = function () {
      _.each($scope.states, function (mainCat) {
        $scope.selectAllFromCategory(mainCat.key);
      });
    };

    $scope.deSelectAllCategories = function () {
      _.each($scope.states, function (mainCat) {
        $scope.deSelectAllFromCategory(mainCat.key);
      });
    };

    $scope.getSubCategoriesForMainCategory = function (mainCat) {
      return $scope.states[mainCat].sub;
    };

    // check if all subcategories of this maincategory are selected
    // all categories that have activities must be subCat.selected === true
    // all categories that have no activities must be subCat.selected === false
    $scope.allSelectedFromCategory = function (mainCatKey) {
      var catsInActs = categoriesInActivities(mainCatKey);
      var countSelected = 0;
      var subCats = $scope.getSubCategoriesForMainCategory(mainCatKey);
      angular.forEach(subCats, function (subCat) {
        if (_.contains(catsInActs, subCat.key)) {
          if (subCat.selected === true) {
            countSelected++;
          }
        } else if (subCat.selected === false) {
          countSelected++;
        }
      });
      if (countSelected === subCats.length) {
        return true;
      }
      return false;
    };

    // if there is no category that is selected, then all categories are deselected
    $scope.noneSelectedFromCategory = function (mainCatKey) {
      var countSelected = 0;
      var subCats = $scope.getSubCategoriesForMainCategory(mainCatKey);
      angular.forEach(subCats, function (subCat) {
        if (subCat.selected === true) {
          countSelected++;
        }
      });
      if (countSelected > 0) {
        return false;
      }
      return true;
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

    $scope.areItemsInThisCategorySelected = function (mainCatKey) {
      if (_.where($scope.getSubCategoriesForMainCategory(mainCatKey), { 'selected': true }).length > 0) {
        return true;
      } else {
        return false;
      }
    };

    // select all subcategories from main category
    // if the subcategory has activities, select them in UI via subCat.selected = true
    // set that it was selected
    // if it has no activities, deselect them in UI
    // but still set that they were selected via subCat.wasselected = true
    // so if there are later some activities for this category, they will be shown
    $scope.selectAllFromCategory = function (mainCatKey) {
      var catsInActs = categoriesInActivities(mainCatKey);

      angular.forEach($scope.getSubCategoriesForMainCategory(mainCatKey), function (subCat) {
        if (_.contains(catsInActs, subCat.key)) {
          subCat.selected = true;
          subCat.wasselected = true;
        } else {
          subCat.selected = false;
          subCat.wasselected = true;
        }
      });
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.deSelectAllFromCategory = function (mainCatKey) {
      angular.forEach($scope.getSubCategoriesForMainCategory(mainCatKey), function (subCat) {
        subCat.selected = false;
        subCat.wasselected = false;
      });
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    // find all categories that are in the activities we get from the map
    function categoriesInActivities(mainCatKey) {
      var catsInActs = [];
      angular.forEach($scope.map.markers, function (activity) {
        if (activity.category.main === mainCatKey) {
          _.each(activity.category.subs, function (subCatInActivity) {

            _.each($scope.getSubCategoriesForMainCategory(mainCatKey), function (subCatInCategories) {
              if (subCatInCategories.key === subCatInActivity.key) {
                catsInActs.push(subCatInCategories.key);
              }
            });
          });
        }
      });
      return _.uniq(catsInActs);
    }

    // count activities that are shown because their maincategory and subcategory/ies are selected
    $scope.numberOfSelectedFromCategory = function (mainCatKey) {
      var countActivities = 0;
      // get selected categories
      var selectedSubCats = _.where($scope.getSubCategoriesForMainCategory(mainCatKey), {selected: true});
      // get all the keys of selected categories in an array
      var selectedSubCatsKeysArray = _.map(selectedSubCats, 'key');

      // now intersect the selectedSubCatsKeysArray with the activitySubCatsKeysArray
      // if the result has at least length === 1 we have a match, count it
      var activitiesForThisMainCategory = _.where($scope.map.markers, { category: { main: mainCatKey}});
      _.each(activitiesForThisMainCategory, function (activity) {
        var activitySubCatsKeysArray = _.map(activity.category.subs, 'key');
        var intersection = _.intersection(activitySubCatsKeysArray, selectedSubCatsKeysArray);
        if (intersection.length > 0) {
          countActivities++;
        }
      });

      return countActivities;
    };

// first time coming here, all the categories are selected
// after a search:
// we find some activities and search for those with the right main category
// only the sub-categories of that activities should be selected and counted
    function setSelectedInit(mainCatKey) {
      var filteredSubCats = categoriesInActivities(mainCatKey);
      angular.forEach($scope.getSubCategoriesForMainCategory(mainCatKey), function (subCat) {
        if (_.contains(filteredSubCats, subCat.key)) {
          subCat.selected = true;
          subCat.wasselected = true;
        } else {
          subCat.selected = false;
          subCat.wasselected = false;
        }
      });
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    }

    function setSelectedFromUsersessionstatesInit() {
      var filteredSubCats;

      _.each(Usersessionstates.states.selectedcategories, function (mainCat) {
        filteredSubCats = categoriesInActivities(mainCat.key);
        _.each(mainCat.sub, function (subCat) {
          if (!_.contains(filteredSubCats, subCat.key)) {
            subCat.selected = false;
          } else {
            if (subCat.wasselected === true) {
              subCat.selected = true;
            }
          }
        });
      });
      $scope.states = angular.copy(Usersessionstates.states.selectedcategories);
      $scope.$apply();
      Usersessionstates.updateSession();
    }

    // number of activities that have this maincategory
    $scope.totalNumberOfCategory = function (mainCatKey) {
      return _.where($scope.map.markers, {category: {main: mainCatKey}}).length;
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
            _.each(bookableItem.events, function (event) {
              event.title = {
                en: bookableItem.description.en,
                de: bookableItem.description.de,
                it: bookableItem.description.it
              };
              events.push(event);
            });
          });
          events = _.sortBy(events, "start");
          events = events.slice(0, 3);
          marker.availability = _.clone(events);
        });
      }

    };
    $scope.getNextAvailableEvents();

    $scope.putIntoShoppingCart = function (activity, event) {
      debug("Put into shopping cart", activity, event);
    };

    $rootScope.$on("InitMapBoundsEvent", function (event, message) {
      debug("INIT MAP BOUNDS EVENT", Usersessionstates.states.selectedcategories);

      initStatesCategories();

      if (!Usersessionstates.states.selectedcategories) {
        angular.forEach($scope.states, function (mainCat) {
          setSelectedInit(mainCat.key);
        });
      } else {
        setSelectedFromUsersessionstatesInit();
      }
    });

// when user changes language, reload controller so that all translations are correct
    $rootScope.$on('$translateChangeSuccess', function () {
      $route.reload();
    });

    $scope.moment = moment;
    $scope.moment.lang($translate.use());

// when language changes globally, reset also in directive
    $rootScope.$on('$translateChangeSuccess', function () {
      $scope.moment.lang($translate.use());
    });

    $scope.googleMap = {};
//    console.log("GOOGLE MAP", $scope.googleMap);

//    $scope.$watch("googleMap", function(oldMap, newMap) {
//      console.log("GOOGLE MAP CHANGED", newMap);
//    }, true);

//    $scope.$watch("map.center", function(oldMap, newMap) {
//      console.log("FRONTEND MAP CHANGED", oldMap, newMap);
//    }, true);

// check if the number of markers in the map has changed
// if yes select these categories that have markers and have been selected
// otherwise deselect
    $scope.$watch("map.markers", function (newMapMarkers, oldMapMarkers) {
      console.log("MAP MARKERS CHANGED", oldMapMarkers.length, newMapMarkers.length, $scope.states);

      if (oldMapMarkers.length !== newMapMarkers.length) {
        selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory();
      }
    }, true);

  }
)
;
