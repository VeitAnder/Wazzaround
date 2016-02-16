'use strict';

angular.module('anorakApp')
  .controller('ActivityPageCtrl', function ($scope, activity, activitybackendmap) {
    $scope.getPagePartial = function () {
      return 'components/activities/activity.html';
    };

    $scope.vm = {
      activity: activity,
      provider: {
        company: "loading.."
      },
      map: {
        center: {
          "longitude": activity.location.lng,
          "latitude": activity.location.lat
        },
        zoom: 9,
        options: activitybackendmap.map.options,
        markercoords: {
          "longitude": activity.location.lng,
          "latitude": activity.location.lat
        }
      }
    };

    $scope.getMarkerIcon = function () {
      return "/img/mapicons/marker-"+ activity.category.main+".png";
    };

//    $scope.models.UserModel.getProfile({id:$scope.activity.owner._reference})
//      .then(function(res) {
//        $scope.$apply(function() {
//          $scope.data.provider = res;
//        });
//      }).done();

  })
  .controller('ActivityCtrl', function ($scope, $filter) {

  });
