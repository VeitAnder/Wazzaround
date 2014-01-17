angular.module('anorakApp')
  .controller('NavBarCtrl', function ($scope, $route) {
    "use strict";
    $scope.projectid = $route.current.params.projectid;
  });