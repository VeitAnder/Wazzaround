'use strict';

angular.module('anorakApp')
  .controller('HeaderCtrl', function ($scope, Projects, supportbar, $location, Users, currentUser) {
    $scope.projects = Projects;

    $scope.isProjectsOpen = false;

    $scope.openProjectsList = function () {
      if ($scope.projects && $scope.projects.getResolvedProjectsList() && $scope.projects.getResolvedProjectsList().length > 0) {
        if (!$scope.isTouch()) {
          $scope.isProjectsOpen = true;
        }
      }
    };

    $scope.isTouch = function () {
      return Modernizr.touch;
    };

    $scope.closeProjectsList = function () {
      $scope.isProjectsOpen = false;
    };

    /*
     SupportBar
     */

    $scope.isSupportBarOpen = function () {
      return supportbar.isSupportBarOpen();
    };

    $scope.toggleSupportBar = function () {
      supportbar.toggle();
    };

    $scope.openSupportBar = function () {
      supportbar.open();
    };

    $scope.closeSupportBar = function () {
      supportbar.close();
    };

    $scope.support = {
      text: "",
      select: "Fehler melden"
    };
    $scope.sendsupport = { requestInProgress: false };
    $scope.sendSupportForm = function () {
      $scope.sendsupport.requestInProgress = true;

      // absolute url where the user is at sending support form
      var info = {};
      info.url = $location.$$absUrl;
      info.user = currentUser.info();
      info.browser = navigator.userAgent;

      Users.sendSupportMail(info, $scope.support.select, $scope.support.text)
        .then(function () {
          $scope.support.text = "";
          $scope.support.select = "Fehler melden";
          $scope.sendsupport.msg = "success";
          $scope.sendsupport.requestInProgress = false;
        })
        .catch(function () {
          $scope.sendsupport.msg = "error";
          $scope.sendsupport.requestInProgress = false;
        });
    };

  });