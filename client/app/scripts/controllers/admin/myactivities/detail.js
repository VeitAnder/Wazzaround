'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope, $location, activity, mapdataservice) {
    $scope.getPagePartial = function () {
      return 'admin/myactivities/detail.html';
    };

    $scope.activity = activity;

    $scope.map = {
      center: {
        "longitude": parseFloat($scope.activity.longitude),
        "latitude": parseFloat($scope.activity.latitude)
      },
      zoom: 9,
      options: mapdataservice.map.options
    };

    $scope.getMarkerIcon = function () {
      return "/img/mapicons/marker-"+$scope.activity.category.main+".svg";
    };

    $scope.delete = function (activity) {
      activity.remove()
        .then(function () {
          console.log("deleted activity", activity);
          $location.path("/admin/myactivities/");
          $scope.$apply();
        });
    };

  });
