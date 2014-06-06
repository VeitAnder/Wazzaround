'use strict';

angular.module('anorakApp')
  .directive('activitybardetail', function () {
    return {
      restrict : 'E',
      controller: function($scope){

        $scope.profile = {
          company : "loading..."
        };

        var loadProviderProfile = function(id) {
          $scope.models.UserModel.getProfile({id:id})
            .then(function(res) {
              console.log("res", res);
              $scope.$apply(function() {
                $scope.profile.company = res.company;
              })
            }).done();
        };


        $scope.$watch('states.selectedactivityid', function(newValue, oldValue) {
          console.log("new selectedactivityid", $scope.states.selectedactivityid);
          loadProviderProfile($scope.getSelectedActivity().owner._reference);
        });

      },
      templateUrl : 'views/directives/activitybardetail.html'
    };
  });
