'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, currentUser, $window, $rootScope, categories, frontendmap, $route, $translate, Usersessionstates, $timeout) {

    $scope.currentUser = currentUser;

    $scope.states = {};

    $scope.categories = categories;

    var checkForCategoryChanges = function (catsFromDB, catsFromLocalStorage) {
      var categoryKeysFromDB = _.map(catsFromDB, 'key');
      var categoryKeysFromLocalStorage = _.map(catsFromLocalStorage, 'key');
      var commonKeys = _.intersection(categoryKeysFromDB, categoryKeysFromLocalStorage);

      if (categoryKeysFromDB.length === categoryKeysFromLocalStorage.length === commonKeys.length) {
        // we have no new keys and no keys to remove
        debug("No new keys and no keys to remove");

      } else {
        var newKeys = _.difference(categoryKeysFromDB, commonKeys);
        var oldKeysToRemove = _.difference(categoryKeysFromLocalStorage, commonKeys);

        // alle keys von categoryKeysFromDB müssen enthalten sein
        // 1. neue Keys in categoryKeysFromDB
        // 2. nicht mehr existierende Keys in local storage
        var newCats = [];
        _.each(newKeys, function (newKey) {
          newCats = newCats.concat(_.where(catsFromDB, { key: newKey }));
        });

        var remainingCats = _.remove(catsFromLocalStorage, function (cat) {
          if (_.contains(oldKeysToRemove, cat.key)) {
            return false;
          } else {
            return true;
          }
        });

        // add new categories from db and remove old ones from local storage
        catsFromLocalStorage = angular.copy(remainingCats);
        catsFromLocalStorage = catsFromLocalStorage.concat(newCats);

        return catsFromLocalStorage;
      }
    };

    // set initial state of category selection:
    // if states are stored, use these, otherwise select all and store locally
    var loadCategoriesIntoStatesObject = function () {

      // if the object is already initialized,
      // it contains "selected" keys, dont overwrite
      if (_.contains(Object.keys($scope.categories), "selected")) {
        return;
      }

      // else see if we have a stored Usersessionstates object, then load that object
      else if (Usersessionstates.states && Usersessionstates.states.selectedcategories) {
        Usersessionstates.states.selectedcategories = angular.copy(checkForCategoryChanges($scope.categories, Usersessionstates.states.selectedcategories));

        // now that main cats are correct, check for subcategory changes
        _.each(Usersessionstates.states.selectedcategories, function (mainCat) {
          var subCatsFromLocalStorage = mainCat.sub;
          var subCatsFromDB = _.find($scope.categories, {key: mainCat.key}).sub;
          mainCat.sub = angular.copy(checkForCategoryChanges(subCatsFromDB, subCatsFromLocalStorage));
        });

      }
//      else {
//
//        // initialize category selection: all main categories closed, all subcategories selected
//        _.each($scope.categories, function (mainCat) {
//          mainCat.open = false;
//          _.each(mainCat.sub, function (subCat) {
//            subCat.selected = true;
//          });
//        });
//
//        Usersessionstates.states.selectedcategories = angular.copy($scope.categories);
//        Usersessionstates.updateSession();
//      }
    };
    loadCategoriesIntoStatesObject();

    var preSelectCategories = function () {
      // we have already selected states and categories in $scope.categories
      if (_.contains(Object.keys($scope.categories), "selected")) {
        return;

        // we have a stored selected states object, fill in on that basis
      } else if (Usersessionstates.states && Usersessionstates.states.selectedcategories) {

        _.each($scope.categories, function (mainCat) {
          var open = _.where(Usersessionstates.states.selectedcategories, {key: mainCat.key})[0].open;
          mainCat.open = open;

          _.each(mainCat.sub, function (subCat) {
            var subCats = _.where(Usersessionstates.states.selectedcategories, {key: mainCat.key})[0].sub;
            subCat.selected = _.where(subCats, {key: subCat.key})[0].selected;
          });
        });
      } else {
        _.each($scope.categories, function (mainCat) {
          mainCat.open = false;
          _.each(mainCat.sub, function (subCat) {
            subCat.selected = true;
          });
        });
      }
    };
    preSelectCategories();

// user clicks on main category box
// this box opens, all other boxes close
// all subcategories in this box will be selected if there are activities for them

    var closeAllFilters = function () {
      _.each($scope.categories, function (category) {
        category.open = false;
      });
    };

    $scope.toggleFilter = function (category) {
      var currentstate = category.open;
      closeAllFilters();
      if (currentstate) {
        category.open = false;
      } else {
        category.open = true;
      }
    };

    $scope.frontendmap = frontendmap;

    $scope.windowOptions = {
      "zIndex": 1000
    };

    $scope.onMarkerClicked = function (markerClicked) {
      //deselect all except clicked on
      _.each($scope.frontendmap.map.markers, function (marker) {
        if (marker._id === markerClicked._id) {
          marker.showWindow = true;
          marker.selected = true;
        } else {
          marker.showWindow = false;
          marker.selected = false;
        }
      });
      // set detail id
      $scope.states.selectedactivityid = markerClicked._id;
      // open detail view of activity when marker got clicked
      $scope.states.activitydetailactive = true;
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
    };

    $scope.deSelectAllFromCategory = function (category) {
      _.each(category.sub, function (subCat) {
        subCat.selected = false;
      });
    };

// find all categories that are in the activities we get from the map
    function categoriesInActivities(mainCatKey) {
      var catsInActs = [];
      _.each($scope.frontendmap.map.markers, function (activity) {
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
      var activitiesForThisMainCategory = _.where($scope.frontendmap.map.markers, { category: { main: category.key}});
      _.each(activitiesForThisMainCategory, function (activity) {
        var activitySubCatsKeysArray = _.map(activity.category.subs, 'key');
        var intersection = _.intersection(activitySubCatsKeysArray, selectedSubCatsKeysArray);
        if (intersection.length > 0) {
          countActivities++;
        }
      });

      return countActivities;
    };

// number of activities that have this maincategory
    $scope.totalNumberOfCategory = function (category) {
      return _.where($scope.frontendmap.map.markers, {category: {main: category.key}}).length;
    };

    $scope.getAddress = frontendmap.getAddress;

//
//
////every activity has bookableItems, like Quadfahren
////this bookableItem Quadfahren has events, like 1.3. Quadfahren, 2.3. Quadfahren, 3.3. Quadfahren
////sort these events by date and save 3 to be displayed when user klicks on activity in index page
//    $scope.getNextAvailableEvents = function () {
//
//      if ($scope.frontendmap.map.markers.length > 0) {
//
//        _.each($scope.frontendmap.map.markers, function (marker) {
//          var events = [];
//
//          _.each(marker.bookableItems, function (bookableItem) {
//            _.each(bookableItem.events, function (event) {
//              event.title = {
//                en: bookableItem.description.en,
//                de: bookableItem.description.de,
//                it: bookableItem.description.it
//              };
//              events.push(event);
//            });
//          });
//          events = _.sortBy(events, "start");
//          events = events.slice(0, 3);
//          marker.availability = _.clone(events);
//        });
//      }
//
//    };
//    $scope.getNextAvailableEvents();
//
//

    $scope.putIntoShoppingCart = function (activity, event) {
      debug("Put into shopping cart", activity, event);
    };

// when user changes language, reload controller so that all translations are correct
// when language changes globally, reset also in directive
    $rootScope.$on('$translateChangeSuccess', function () {
      $route.reload();
      $scope.moment.lang($translate.use());
    });

    $scope.moment = moment;
    $scope.moment.lang($translate.use());

    $scope.$watch("categories", function (newCats, oldCats) {
      Usersessionstates.states.selectedcategories = angular.copy($scope.categories);
      Usersessionstates.updateSession();
    }, true);

    // activitybar functionality

    $scope.getSelectedActivity = function () {
      // return selected activity
      var selectedactivity = _.find($scope.states.filteredactivities, function (activity) {
        return activity._id === $scope.states.selectedactivityid;
      });

      // if no activity is selected, return first one in filtered array and set it as selected
      if (!selectedactivity && $scope.states.filteredactivities && $scope.states.filteredactivities.length > 0) {
        $scope.states.selectedactivityid = $scope.states.filteredactivities[0]._id;
        selectedactivity = $scope.states.filteredactivities[0];
      }

      // if no activity is at all available in $scope.states.filteredactivities, show message in activitybar
      return selectedactivity;
    };

    $scope.selectnext = function () {
      //simple implementation - get index of current selected id
      var index = _.findIndex($scope.states.filteredactivities, { '_id': $scope.getSelectedMarkerId() });
      var newindex = index + 1;

      if (newindex > $scope.states.filteredactivities.length - 1) {
        newindex = 0;
        $scope.states.selectedactivityid = $scope.states.filteredactivities[newindex]._id;
      } else {
        $scope.states.selectedactivityid = $scope.states.filteredactivities[newindex]._id;
      }

      $timeout(function () {
        $scope.$apply();
      });

      return newindex;
    };

    $scope.selectprev = function () {
      //simple implementation - get index of current selected id
      var index = _.findIndex($scope.states.filteredactivities, { '_id': $scope.getSelectedMarkerId() });
      var newindex = index - 1;

      if (newindex < 0) {
        newindex = $scope.states.filteredactivities.length - 1;
        $scope.states.selectedactivityid = $scope.states.filteredactivities[newindex]._id;
      } else {
        $scope.states.selectedactivityid = $scope.states.filteredactivities[newindex]._id;
      }

      $timeout(function () {
        $scope.$apply();
      });

      return newindex;
    };

    $scope.toggleCurrentActivity = function () {
      $scope.states.activitydetailactive = !$scope.states.activitydetailactive;
    };

    $scope.getSelectedMarkerId = function () {
      return $scope.states.selectedactivityid;
    };

    $scope.getMarkerIcon = function (activity) {
      if (activity._id === $scope.getSelectedMarkerId()) {
        return frontendmap.getMarkerIconActive(activity.category.main);
      } else {
        return frontendmap.getMarkerIcon(activity.category.main);
      }
    };

    $scope.getIndexFilteredActivities = function (activity) {
      var index = _.findIndex($scope.states.filteredactivities, function (item) {
        return activity._id === item._id;
      });
      // make index non-programmer style :-)
      return index + 1;
    };

    $scope.lowestPriceOfSelectedActivity = function() {

      var bookableItems = $scope.getSelectedActivity().bookableItems;

      var min = _.min(
        _.map(bookableItems, function(item) {
          return _.min(item.events, 'price').price;
        })
      );

      return min;
    };

  });
