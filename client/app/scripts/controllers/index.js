'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window, $rootScope, categories, frontendmap, $route, $translate, Usersessionstates) {

    $scope.currentUser = currentUser;

    $scope.states = {};

    $scope.categories = categories;

    // set initial state of category selection:
    // if states are stored, use these, otherwise select all and store locally
    var loadCategoriesIntoStatesObject = function () {

      // if the object is already initialized, app is already running, dont overwrite
      if (Object.keys($scope.states).length > 0) {
        return;
      }

      if (Usersessionstates.states && Usersessionstates.states.selectedcategories) {
        $scope.states = angular.copy(Usersessionstates.states.selectedcategories);
      } else {

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
//    loadCategoriesIntoStatesObject();

    var preSelectCategories = function () {
      if (!Usersessionstates.states.selectedcategories) {
        angular.forEach($scope.states, function (mainCat) {
          setSelectedInit(mainCat.key);
        });
      } else {
        setSelectedFromUsersessionstatesInit();
      }
    };
//    preSelectCategories();

    var selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory = function () {
      _.each($scope.states, function (mainCat) {
        var catsInActs = categoriesInActivities(mainCat.key);

        angular.forEach($scope.getSubCategoriesForMainCategory(mainCat.key), function (subCat) {
          if (_.contains(catsInActs, subCat.key)) {
//            if (subCat.wasselected === true) {
            subCat.selected = true;
            subCat.wasselected = true;
//            }
          } else {
            subCat.selected = false;
            subCat.wasselected = true;
          }
        });
      });
    };

    // user clicks on main category box
    // this box opens, all other boxes close
    // all subcategories in this box will be selected if there are activities for them
    $scope.toggleFilter = function (category) {
      category.open = !category.open;

//        selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory();

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

    $scope.selectedCategoryFilter = function (activity) {
      var flag = false;

      if (!activity.category.main) {   // this occurs because in edit mode it is allowed to save without selecting a category
        return false;
      }

      _.each($scope.categories, function (maincategory) {
        // check for main category
        if (activity.category.main === maincategory.key) {
          var subcategories = _.map(activity.category.subs, function (subcategory) {
            return subcategory.key;
          });
          var selectedsubcategories = _.map(maincategory.sub, function (subcategory) {
            if (subcategory.selected) {
              return subcategory.key;
            }
          });
          if (_.intersection(subcategories, selectedsubcategories).length > 0) {
            flag = true;
          }
        }
      });
      return flag;
    };

    $scope.toggleCategorySelection = function (category) {
      category.selected = !category.selected;
      category.wasselected = category.selected;

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.selectAllCategories = function () {
      console.log("selectAllCategories");
      _.each($scope.categories, function (mainCat) {
        $scope.selectAllFromCategory(mainCat);
      });
    };

    $scope.deSelectAllCategories = function () {
      _.each($scope.categories, function (mainCat) {
        $scope.deSelectAllFromCategory(mainCat);
      });
    };

    $scope.getSubCategoriesForMainCategory = function (mainCat) {
      return _.find($scope.categories, { "key": mainCat}).sub;
    };

    // check if all subcategories of this maincategory are selected
    $scope.allSelectedFromCategory = function (category) {
      var numberOfSelected = _.filter(category.sub, {"selected": true}).length;
      if (numberOfSelected === category.sub.length) {
        return true;
      }
      return false;
    };

    // if there is no category that is selected, then all categories are deselected
    $scope.noneSelectedFromCategory = function (category) {
      var numberOfSelected = _.filter(category.sub, {"selected": true}).length;
      if (numberOfSelected === 0) {
        return true;
      }
      return false;
    };

    $scope.allSelected = function () {
      var flag = true;
      _.each($scope.categories, function (maincategory) {
        if (!$scope.allSelectedFromCategory(maincategory)) {
          flag = false;
          return false;
        }
      });
      return flag;
    };

    $scope.noneSelected = function () {
      var flag = true;
      _.each($scope.categories, function (maincategory) {
        if (!$scope.noneSelectedFromCategory(maincategory)) {
          flag = false;
          return false;
        }
      });
      return flag;
    };

    $scope.getMarkerIcon = function (activity) {
      return "/img/mapicons/marker-" + activity.category.main + ".svg";
    };

    $scope.areItemsInThisCategorySelected = function (category) {
      if (_.where(category.sub, { 'selected': true }).length > 0) {
        return true;
      } else {
        return false;
      }
    };

    // select all subcategories from main category
    $scope.selectAllFromCategory = function (category) {
      _.each(category.sub, function (subCat) {
        subCat.selected = true;
      });
//      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
//      Usersessionstates.updateSession();
    };

    $scope.deSelectAllFromCategory = function (category) {
      _.each(category.sub, function (subCat) {
        subCat.selected = false;
      });
//      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
//      Usersessionstates.updateSession();
    };

    // find all categories that are in the activities we get from the map
    function categoriesInActivities(mainCatKey) {
      var catsInActs = [];
      _.each($scope.map.markers, function (activity) {
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
    $scope.numberOfSelectedFromCategory = function (category) {
      var countActivities = 0;
      // get selected categories
      var selectedSubCats = _.where(category.sub, {selected: true});
      // get all the keys of selected categories in an array
      var selectedSubCatsKeysArray = _.map(selectedSubCats, 'key');

      // now intersect the selectedSubCatsKeysArray with the activitySubCatsKeysArray
      // if the result has at least length === 1 we have a match, count it
      var activitiesForThisMainCategory = _.where($scope.map.markers, { category: { main: category.key}});
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
    function setSelectedInit(mainCatKey) {
      angular.forEach($scope.getSubCategoriesForMainCategory(mainCatKey), function (subCat) {
        subCat.selected = true;
        subCat.wasselected = true;
      });
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    }

    function setSelectedFromUsersessionstatesInit() {
      $scope.states = angular.copy(Usersessionstates.states.selectedcategories);
      $scope.$apply();
      Usersessionstates.updateSession();
    }

    // number of activities that have this maincategory
    $scope.totalNumberOfCategory = function (category) {
      return _.where($scope.map.markers, {category: {main: category.key}}).length;
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

    $scope.$watch("map.zoom", function (newMap, oldMap) {
      console.log("MAP ZOOM CHANGED", oldMap, newMap);
    });


// check if the number of markers in the map has changed
// if yes select these categories that have markers and have been selected
// otherwise deselect
    $scope.$watch("map.markers", function (newMapMarkers, oldMapMarkers) {
      console.log("MAP MARKERS CHANGED", oldMapMarkers.length, newMapMarkers.length, $scope.states);

      if (oldMapMarkers.length !== newMapMarkers.length) {
        selectAllSubcategoriesThatHaveActivitiesAndHaveBeenSelectedInActiveMainCategory();
      }
    }, true);

  });
