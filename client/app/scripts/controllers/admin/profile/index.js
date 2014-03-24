'use strict';

angular.module('anorakApp')
  .controller('AdminEditprofilePageCtrl', function ($scope) {
    $scope.getPagePartial = function () {
      return 'views/admin/profile/index.html';
    };
  })
  .controller('AdminEditprofileCtrl', function ($scope, currentUser) {

  });
