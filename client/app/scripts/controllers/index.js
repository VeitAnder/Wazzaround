'use strict';

angular.module('anorakApp')
  .controller('indexCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];



    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };


  });
