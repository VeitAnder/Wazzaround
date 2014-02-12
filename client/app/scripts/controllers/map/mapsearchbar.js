'use strict';

angular.module('anorakApp')
  .controller('MapsearchbarCtrl', function ($scope, mapdataservice) {

    $scope.search = {
      minDate: new Date(),
      address: ""
    };

    $scope.findAddressOnMap = function () {
      if ($scope.search.address.length > 0) {
        mapdataservice.setAddress($scope.search.address).then(function () {
        });
      }
    }

  });
