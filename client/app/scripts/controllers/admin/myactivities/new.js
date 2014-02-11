'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesNewCtrl', function ($scope, $location) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/new.html';
    };

    $scope.activity = ActivityModel.createObject();

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

          debug("$scope.map.clickedMarker", $scope.map.clickedMarker);
          $scope.$apply();
        }
      }
    };

    $scope.getMarkerIcon = function () {
      return "/img/mapicons/marker-sports.svg";
    };

    $scope.save = function () {
      $scope.activity.save()
        .then(function (activity) {
          debug("save success");

          $location.path("/admin/myactivities/");
          $scope.$apply();
        });
    };

  });
