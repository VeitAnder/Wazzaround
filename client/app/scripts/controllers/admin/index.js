'use strict';

angular.module('anorakApp')
  .controller('AdminIndexCtrl', function ($scope, $location, currentUser) {
    $scope.getPagePartial = function () {
      return 'views/admin/index.html';
    };

    if (currentUser.user.userType === 'user') {
      $location.path('/admin/editprofile/');
    } else if(currentUser.user.userType === 'admin' || currentUser.user.userType === 'provider') {
      $location.path("/admin/myactivities/");
    }

  });
