'use strict';

angular.module('anorakApp')
  .controller('AdminMyactivitiesNewCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/myactivities/new.html';
    };
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
