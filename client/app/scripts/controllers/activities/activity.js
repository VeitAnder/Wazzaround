'use strict';

angular.module('anorakApp')
  .controller('ActivityPageCtrl', function ($scope, activity) {
    $scope.getPagePartial = function () {
      return 'views/activities/activity.html';
    };
    $scope.activity = activity;

    $scope.provider = {
      company : "loading.."
    };

    $scope.models.UserModel.getProfile({id:$scope.activity.owner._reference})
      .then(function(res) {
        $scope.$apply(function() {
          $scope.provider = res;
        })
      }).done();

  })
  .controller('ActivityCtrl', function ($scope) {

  });
