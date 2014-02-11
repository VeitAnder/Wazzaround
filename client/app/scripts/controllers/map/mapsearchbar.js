'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, $rootScope, mapdataservice) {

    $scope.search = {
      minDate: new Date(),
      address: ""
    };

    $scope.findAddressOnMap = function () {
      console.log("FIND ADDRESS ON MAP", $scope.search.address);

      if ($scope.search.address.length > 0) {
        mapdataservice.setAddress($scope.search.address).then(function() {
          console.log("AFTER SETTING ADDRESS IN SEARCHBAR", mapdataservice.map.address);
          $rootScope.apply();
          $scope.apply();
        });
      }
    }

  });
