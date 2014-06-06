'use strict';

angular.module('anorakApp')
  .directive('activityowner', function () {
    return {
      template: '<span>{{vm.owner}}</span>',
      restrict: 'E',
      scope: {
        activity: "=activity"
      },
      controller: function activityOwnerCtrl($scope, models) {

        $scope.vm = {
        };

        var loadProviderProfile = function () {
          models.UserModel.getProfile({id: $scope.activity.owner._reference})
            .then(function (res) {
              $scope.$apply(function () {
                $scope.vm.owner = res.company;
              });
            })
            .done();
        };

        $scope.$watch('activity.owner._reference', function (newValue, oldValue) {
          loadProviderProfile();
        });

      }
    };
  });
