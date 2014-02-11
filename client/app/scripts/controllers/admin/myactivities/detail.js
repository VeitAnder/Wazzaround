'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesDetailCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/detail.html';
    };


    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
