'use strict';

angular.module('anorakApp')
  .controller('ActivityPageCtrl', function ($scope, activity) {
    $scope.getPagePartial = function () {
      return 'views/activities/activity.html';
    };

    // TODO: btw.. es ist üblich $scope.vm (view model) zu verwenden
    $scope.data = {
      activity: activity,
      provider: {
        company : "loading.."
      }
    };

//    $scope.models.UserModel.getProfile({id:$scope.activity.owner._reference})
//      .then(function(res) {
//        $scope.$apply(function() {
//          $scope.data.provider = res;
//        });
//      }).done();

  })
  .controller('ActivityCtrl', function ($scope) {

  });
