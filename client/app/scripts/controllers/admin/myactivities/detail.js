'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope, $location, activity, activitybackendmap, $translate, $rootScope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/detail.html';
    };

    $scope.activity = activity;

    $scope.map = {
      center: {
        "longitude": $scope.activity.location.lng,
        "latitude": $scope.activity.location.lat
      },
      zoom: 9,
      options: activitybackendmap.map.options,
      markercoords: {
        "longitude": $scope.activity.location.lng,
        "latitude": $scope.activity.location.lat
      }
    };

    $scope.lang = $translate.use();
    // when language changes globally, reset also here
    $rootScope.$on('$translateChangeSuccess', function () {
      $scope.lang = $translate.use();
    });

    $scope.getMarkerIcon = function () {
      return "/img/mapicons/marker-"+$scope.activity.category.main+".png";
    };

    $scope.delete = function () {
      $scope.activity.remove()
        .then(function () {
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done();
    };




  });
