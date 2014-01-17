angular.module('anorakApp')
  .config(
  function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/projects', {
        templateUrl: 'projects/projects_list.tpl.html',
        controller: 'ProjectsViewCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }]
        }
      })
      .when('/projects/new', {
        templateUrl: 'projects/projects_new.tpl.html',
        controller: 'ProjectsNewCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }],
          resolvenewprojectsmodel: ['Projects',
            function (Projects) {
              return Projects.newprojectmodel();
            }],
          resolvecurrentuser: ['Users', 'AuthenticationService',
            function (Users, AuthenticationService) {
              return AuthenticationService.requestCurrentUser().then(function (currentUser) {
                return Users.getById(currentUser.info().id);
              });
            }]
        }
      });
  })
  .controller('ProjectsViewCtrl', function ($scope, $location, resolveprojectscollection) {
    'use strict';

    $scope.projects = resolveprojectscollection;

  })
  .controller('ProjectsNewCtrl', function ($scope, $location, $log, Projects, resolvenewprojectsmodel, currentUser, resolvecurrentuser) {
    'use strict';

    window.testSope = $scope;   // testing only

    // TODO: currentUser.info() geht nicht (da hängen zu wenige Informationen am Object, ich verwende deswegen resolvecurrent user
    //$scope.user = currentUser.info();
    $scope.user = resolvecurrentuser;

    // wurde noch kein Projekt angelegt wird die "Trail-Period"-Message angezeigt
    if ($scope.user.payment !== undefined) {
      if ($scope.user.payment.firstproject === undefined) {  // no projects for this user so far
        $scope.showStartTrailPeriodMsg = true;
      }
    } else {
      $scope.showStartTrailPeriodMsg = false;
    }

    $scope.states = {
      submitted: false,
      noroleselected: true,
      requestInProgress: false,
      error: false
    };

    $scope.newproject = resolvenewprojectsmodel;
    // initialize participants list
    $scope.newproject.participants = [
      {
        "roles": []
      }
    ];

    $scope.cancel = function () {
      $location.path('/projects');
    };

    $scope.isProjectFormValid = function () {
      return (!$scope.valForm.$invalid && !$scope.states.noroleselected);
    };

    $scope.saveProject = function () {
      $scope.states.submitted = true;

      if ($scope.isProjectFormValid() && !$scope.states.requestInProgress) {
        $scope.states.requestInProgress = true;
        var Project = new Projects($scope.newproject);
        Project.$save(function (savedproject) {
          $location.path("/projects/" + savedproject.$id() + "/plans/");
        }, function (error) {
          $scope.states.error = true;
          $log("Error creating project", error);
        });
      }

    };

    // on role selection
    // initialize $scope.roleselectionlist
    $scope.rolesinproject = resolvenewprojectsmodel.roles;
    $scope.onRoleSelect = function (selectionresults) {
      // check if at least one role is selected when in multi select mode
      if (selectionresults.selectedroleslist.length > 0) {
        $scope.states.noroleselected = false;
      } else {
        $scope.states.noroleselected = true;
      }
      // 1. add entire roleslist to project
      $scope.newproject.roles = selectionresults.allroleslist;
      // 2. add selected roles to first participant which will become the project owner
      $scope.newproject.participants[0].roles = selectionresults.selectedroleslist;
    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    $scope.showError = function (fieldName, error) {
      var showerror = false;
      //console.log("ALL ERRORS", $scope.valFormInvite[fieldName].$error);
      //console.log("ERROR " + error, $scope.valFormInvite[fieldName].$error[error]);
      if ($scope.valForm[fieldName].$error[error] && $scope.states.submitted) {
        showerror = true;
      }
      return showerror;
    };

  }
);