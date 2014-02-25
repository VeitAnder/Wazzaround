'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesEditCtrl', function ($scope, $location, activity, categories, mapdataservice, $route) {
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

//    // reset activity.category.sub when activity.category.main changes
//    $scope.$watch('activity.category.main', function () {
//      $scope.activity.category.sub = undefined;
//    });

    $scope.map = {
      center: {
        "longitude": 8.01177978515625,
        "latitude": 45.12199086176226
      },
      zoom: 9,
      clickedMarker: {
        title: 'Location of activity',
        latitude: null,
        longitude: null
      },
      options: mapdataservice.map.options,
      events: {
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope
          debug("user defined event: " + eventName, mapModel, originalEventArgs);

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'Location of activity',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          }
          else {
            $scope.map.clickedMarker.latitude = e.latLng.lat();
            $scope.map.clickedMarker.longitude = e.latLng.lng();
          }

          //update model
          $scope.activity.latitude = e.latLng.lat();
          $scope.activity.longitude = e.latLng.lng();

          debug("$scope.map.clickedMarker", $scope.map.clickedMarker);
          $scope.$apply();
        }
      }
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

    $scope.save = function () {
      debug("save() called");
      $scope.activity.save()
        .then(function (activity, err) {
          if (err) {
            debug("err", err);
          }
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done(); // <-----------------1!!! SEHR WICHTIG immer done aufrufen! Sonst bekommt ihr nicht mit wenn was schief lief!
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

    // only when creating element
    if (!$scope.activity.availability[0]) {
      $scope.newavailability = {
        start: undefined,
        end: undefined,
        quantity: undefined
      };

      $scope.activity.availability[0] = $scope.newavailability;

    }

  });
