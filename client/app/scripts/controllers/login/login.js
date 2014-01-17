angular.module('login', ['services.authentication', 'services.localizedMessages'])
  .config(function ($routeProvider) {
    'use strict';

    var routeconfig = {
      templateUrl: 'login/login_page.tpl.html',
      controller: 'LoginPageCtrl',
      reloadOnSearch: false
    };

    $routeProvider
      .when('/login/', routeconfig)
      .when('/login/accessdenied/', {
        templateUrl: 'login/accessdenied.tpl.html',
        controller: 'AccessdeniedPageCtrl'
      })
      .when('/login/:confirmeduseremail', routeconfig)
      .when('/login/:confirmeduseremail/:confirmed', routeconfig);

  })
  .controller('LoginPageCtrl', function ($scope, $location, AuthenticationService, $routeParams, APP_CONFIG) {
    'use strict';

    if ($routeParams.redirect) {
      $scope.actionurl = APP_CONFIG.APIUrl + "login/?redirect=" + $routeParams.redirect;
    } else {
      $scope.actionurl = APP_CONFIG.APIUrl + "login/";
    }

    // check for query params, if there are some, write to auth error, the params are set via security.js on server side
    $scope.state = {
      autherrortype: $routeParams.error
    };
    $scope.user = {};

    if ($routeParams.confirmeduseremail) {
      $scope.user.email = $routeParams.confirmeduseremail;
    }

    if ($routeParams.confirmed === "confirmed") {
      $scope.state.confirmed = true;
    } else if ($routeParams.confirmed === "alreadyconfirmed") {
      $scope.state.alreadyconfirmed = true;
    }

    $scope.register = function () {
      $location.path('/registration');
    };

    $scope.forgotPassword = function () {
      $location.path('/registration/forgotpassword/');
    };

  });