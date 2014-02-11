'use strict';

angular.module('anorakApp')
  .controller('AdminIndexCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/index.html';
    };

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


  });
