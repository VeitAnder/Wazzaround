'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditCtrl', function ($scope, $location, activity, categories, mapdataservice, $route, $rootScope) {
    $scope.getPagePartial = function () {
      return 'admin/myactivities/edit.html';
    };

    //only check once at initialization time
    if ($route.current.$$route.originalPath === "/admin/myactivities/new") {
      $scope.newMode = true;
    } else {
      $scope.newMode = false;
    }

    $scope.isNewMode = function () {
      return $scope.newMode;
    };

    $scope.categories = categories;
    $scope.activity = activity;

    $scope.getSubCategories = function () {
      var maincategory = _.find(categories, { 'key': $scope.activity.category.main });
      if (maincategory) {
        return maincategory.sub;
      }
    };

    $scope.isTitleInSubcats = function (title) {
      var found = _.filter($scope.activity.category.subs, function (sub) {
        if (sub.title === title) {
          return true;
        }
      });
      if (found.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    $scope.setSubcat = function (title, key) {
      if (!$scope.activity.category.subs) {
        $scope.activity.category.subs = [];
      }
      if ($scope.isTitleInSubcats(title)) {
        _.remove($scope.activity.category.subs, { 'title': title });
      } else {
        $scope.activity.category.subs.push({ 'title': title });
      }
    };

//    // reset activity.category.sub when activity.category.main changes
//    $scope.$watch('activity.category.main', function () {
//      $scope.activity.category.sub = undefined;
//    });

    $scope.map = mapdataservice.map;
    $scope.map.clickedMarker = {
      title: 'Location of activity',
      latitude: null,
      longitude: null
    };

    if (activity.latitude) {
      $scope.map.center.latitude = $scope.activity.latitude;
      $scope.map.center.longitude = $scope.activity.longitude;
      $scope.map.clickedMarker.latitude = $scope.activity.latitude;
      $scope.map.clickedMarker.longitude = $scope.activity.longitude;
    }

    $scope.getMarkerIcon = function () {
      if ($scope.activity.category.main) {
        return "/img/mapicons/marker-" + $scope.activity.category.main + ".svg";
      } else {
        return "/img/mapicons/marker.svg";
      }
    };

    $scope.getMarkerLabel = function () {
      return "Activity location";
    };

    // address:
    // user enters address
    // address will be set on
    $scope.setAddressOnMap = function () {
      console.log("WILL SET ADDRESS", $scope.activity.address);
      mapdataservice.findAddressOnMap($scope.activity);
      $scope.map = mapdataservice.map;

    };

    $rootScope.$on("EditMapChangeEvent", function (event, message) {
      debug("EDIT MAP CHANGED !!! MARKERS: ", $scope.map.markers);

      //update model and set marker by simulating click on map
      $scope.map.events.click();

      $scope.activity.latitude = $scope.map.center.latitude;
      $scope.activity.longitude = $scope.map.center.longitude;
      $scope.map.clickedMarker.title = 'Location of activity';

      debug("$scope.map.clickedMarker", $scope.map.clickedMarker);
    });

    // Save the Activiy
    $scope.save = function () {
      debug("save() called", $scope.activity);

      // check if there was only a marker set or an address entered
      if(!$scope.activity.latitude) {
        $scope.activity.latitude = $scope.map.clickedMarker.latitude;
        $scope.activity.longitude = $scope.map.clickedMarker.longitude;
      }

      var saveItemsPromises = [];

      _.forEach($scope.activity.bookableItems, function (item) {
        console.log("event", item.ref().events[0]); // nicht nur 0 sondern alle
        if (item.ref().events.length > 0 && item.ref().events[0].repeating === true) {
          console.log("save repeating events!", item.ref());
          saveItemsPromises.push($scope.models.BookableItemModel.saveWithRepeatingEvents({
            obj: item.ref()
          }));
          // TODO: die Referenz auf die neu erstellten events fehlen noch
        } else {
          saveItemsPromises.push(item.ref().save());  // save all BookableItems
        }
      });

      Q.all(saveItemsPromises)
        .then(function (results) {  // all BookableItems are saved
          console.log("all results", results);
          return $scope.activity.save();  // save the activity
        })
        .then(function (activity) {
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done();
    };

    $scope.delete = function () {
      $scope.activity.remove()
        .then(function () {
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done();
    };

    $scope.cancel = function () {
      $location.path("/admin/myactivities/");
    };

    /*
     // only when creating element
     if (!$scope.activity.availability[0]) {
     $scope.newavailability = {
     start: undefined,
     end: undefined,
     quantity: undefined
     };

     $scope.activity.availability[0] = $scope.newavailability;

     }
     */

  });
