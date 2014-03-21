'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope, $location, activity, activitybackendmap) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/detail.html';
    };

    $scope.activity = activity;

    $scope.map = {
      center: {
        "longitude": parseFloat($scope.activity.longitude),
        "latitude": parseFloat($scope.activity.latitude)
      },
      zoom: 9,
      options: activitybackendmap.map.options
    };

    $scope.getMarkerIcon = function () {
      return "/img/mapicons/marker-"+$scope.activity.category.main+".svg";
    };

    $scope.delete = function () {
      $scope.activity.remove()
        .then(function () {
          $location.path("/admin/myactivities/");
          $scope.$apply();
        }).done();
    };

  });
