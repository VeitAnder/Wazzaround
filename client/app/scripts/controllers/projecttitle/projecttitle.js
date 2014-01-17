angular.module('anorakApp')
  .controller('ProjectTitleCtrl', function ($scope, $route, Projects) {
    'use strict';

    $scope.project = Projects.getResolvedCurrentProject();

    console.log("$scope.project", $scope.project);
    console.log("Projects", Projects);


    $scope.state = {
      requestInProgress: false,
      showeditform: false,
      userIsAllowedToEdit: false,
      isOwner: false
    };

    // storage of original Project Data
    $scope.storedProjectData = {};

    if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
      $scope.state.userIsAllowedToEdit = true;
    }

    if ($scope.project.isCurrentUserProjectOwner()) {
      $scope.state.isOwner = true;
    } else {
      $scope.state.isOwner = false;
      $scope.owner = $scope.project.getProjectOwner();
    }

    $scope.edit = function () {
      if ($scope.state.userIsAllowedToEdit) {
        angular.copy($scope.project, $scope.storedProjectData);
        $scope.state.showeditform = true;
      }
    };

    $scope.cancel = function () {
      angular.copy($scope.storedProjectData, $scope.project);
      $scope.state.showeditform = false;
    };

    $scope.save = function () {
      if (!$scope.valForm.$invalid && !$scope.state.requestInProgress && $scope.state.showeditform) {
        $scope.state.requestInProgress = true;

        $scope.project.updateTitle(function (project) {
          $scope.state.showeditform = false;
          $scope.state.requestInProgress = false;

        }, function (err) {
          $scope.state.requestInProgress = false;
        });
      }
    };

  });