'use strict';

angular.module('anorakApp')
  .controller('LoginCtrl', function ($scope, $routeParams, $location, currentUser) {
    'use strict';


    debug("authenticated", currentUser.authenticated, $scope.currentUser.authenticated);

    if (currentUser.authenticated) {
      $location.path('/admin/');
    }

    $scope.form = {};

    // check for query params, if there are some, write to auth error, the params are set via security.js on server side
    $scope.state = {
//      autherrortype: $routeParams.error
    };

//    if ($routeParams.confirmeduseremail) {
//      $scope.user.email = $routeParams.confirmeduseremail;
//    }

//    if ($routeParams.confirmed === "confirmed") {
//      $scope.state.confirmed = true;
//    } else if ($routeParams.confirmed === "alreadyconfirmed") {
//      $scope.state.alreadyconfirmed = true;
//    }

    $scope.login = function () {
      currentUser.login($scope.form.username, $scope.form.password)
        .then(function () {
          $location.path('/admin/');
        })
        .fail(function (err) {
          $scope.state.error = true;
          $scope.state.message = err.message;
          $scope.$apply();
        });
    };

  });