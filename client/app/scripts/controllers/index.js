'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope, resolvedActivities, currentUser, $window, $rootScope, categories, resolvedMap, frontendmap, $route, $translate, Usersessionstates) {

    $scope.currentUser = currentUser;

    $scope.states = {};

    // set initial state of category selection:
    // if states are stored, use these, otherwise select all and store locally
    var initStatesCategories = function () {

      // if the object is already initialized, app is already running, dont overwrite
      if(typeof $scope.states !== undefined && Object.keys($scope.states).length > 0) {
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
          });
        });

        Usersessionstates.states.selectedcategories = angular.copy($scope.states);
        Usersessionstates.updateSession();
      }
    };
    initStatesCategories();

    // user clicks on main category box
    // this box opens, all other boxes close
    // all subcategories in this box will be selected
    $scope.toggleFilter = function (category) {
      if ($scope.states[category].open) {
        $scope.states[category].open = false;
      } else {
        angular.forEach($scope.states, function (item) {
          item.open = false;
        });
        $scope.states[category].open = true;

        // select all subcategories
        _.each($scope.states, function (mainCat) {
          if (mainCat.key === category) {
            $scope.selectAllFromCategory(mainCat.key);
          } else {
            $scope.deSelectAllFromCategory(mainCat.key);
          }
        });
      }

      Usersessionstates.states.categoryfilter = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.map = resolvedMap;

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

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.selectAllCategories = function () {
      angular.forEach($scope.states, function (mainCat) {
        angular.forEach(mainCat.sub, function (subCat) {
          subCat.selected = true;
        });
      });

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.deSelectAllCategories = function () {
      angular.forEach($scope.states, function (mainCat) {
        angular.forEach(mainCat.sub, function (subCat) {
          subCat.selected = false;
        });
      });
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.getMainCategory = function (mainCat) {
      return $scope.states[mainCat];
    };

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

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    };

    $scope.deSelectAllFromCategory = function (mainCat) {
      angular.forEach($scope.getMainCategory(mainCat).sub, function (category) {
        category.selected = false;
      });

      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
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

    // problem here: what if categories stay selected, but there are none?
    // then this number is false
    $scope.numberOfSelectedFromCategory = function (mainCat) {
      var catsInActs = categoriesInActivities(mainCat);
      var countSelected = 0;
      angular.forEach($scope.getMainCategory(mainCat).sub, function (subCat) {
        if (_.contains(catsInActs, subCat.key)) {
          if (subCat.selected === true) {
            countSelected++;
          }
        } else {
          subCat.selected = false;  // TODO DIRTY HACK
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
      Usersessionstates.states.selectedcategories = angular.copy($scope.states);
      Usersessionstates.updateSession();
    }

    function setSelectedFromUsersessionstates() {
      var filteredSubCats;

      _.each(Usersessionstates.states.selectedcategories, function (mainCat) {
        filteredSubCats = categoriesInActivities(mainCat.key);
        _.each(mainCat.sub, function (subCat) {
          if (!_.contains(filteredSubCats, subCat.key)) {
            subCat.selected = false;
          }
        });
      });
      $scope.states = angular.copy(Usersessionstates.states.selectedcategories);
      $scope.$apply();
      Usersessionstates.updateSession();
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
          setSelected(mainCat.key);
        });
      } else {
        setSelectedFromUsersessionstates();
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

//    $scope.$watch("map.markers", function (oldMapMarkers, newMapMarkers) {
//      console.log("MAP MARKERS CHANGED", oldMapMarkers.length, newMapMarkers.length, $scope.states);
//      // TODO select according to last selected
//
//    }, true);

  });
