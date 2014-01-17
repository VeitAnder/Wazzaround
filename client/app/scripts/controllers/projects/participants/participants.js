angular.module('anorakApp')
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider
      .when('/projects/:projectid/participants/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'ParticipantsListCtrl',
        resolve: {
          resolveparticipants: ['$route', 'Projects',
            function ($route, Projects) {
              return Projects.findAllParticipants($route.current.params.projectid);
            }],
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }]
        }
      })
      .when('/projects/:projectid/participants/new/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'ParticipantsNewCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }]
        }
      })
      .when('/projects/:projectid/participants/:participantid/', {
        templateUrl: 'projects/projects_basepagetemplate.tpl.html',
        controller: 'ParticipantsDetailCtrl',
        resolve: {
          resolveprojectscollection: ['Projects',
            function (Projects) {
              return Projects.resolveProjectsList();
            }],
          resolvedactivities: ['$route', 'Activities',
            function ($route, Activities) {
              return Activities.getAllFromProjectOfParticipant($route.current.params.projectid, $route.current.params.participantid);
            }]
        }
      });
  })
  .controller('ParticipantsListCtrl', function ($scope, $route, $location, $routeParams, resolveparticipants, Projects) {
    'use strict';

    //set navbaractivetab
    $scope.navbaractivetab = "participants";

    $scope.getPagePartial = function () {
      return 'projects/participants/participants_list_page.tpl.html';
    };

    $scope.participantslist = resolveparticipants;

    $scope.silentParticipant = function (participant) {
      return participant.permission !== "silent";
    };

    $scope.navigateToParticipantDetailPage = function (id) {
      $location.path("projects/" + $routeParams.projectid + "/participants/" + id + "/");
    };

    $scope.orderField = "company";
    $scope.orderReverse = false;
    $scope.setOrderField = function (field) {
      if ($scope.orderField === field) {
        $scope.orderReverse = !$scope.orderReverse;
      }
      $scope.orderField = field;
    };

    $scope.orderByField = function (participant) {
      switch ($scope.orderField) {
        case "email":
          return participant.user.email;
        case "company":
          return participant.company;
        case "role":
          return participant.user.email;
        //case "lastName":
        //return participant.user.profile.lastName;
      }
    };

    $scope.gotoNewParticipantsPage = function () {
      $location.path("projects/" + $routeParams.projectid + "/participants/new/");
    };

    if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
      $scope.isUserAllowedToAddParticipants = true;
    }

  })
  .controller('ParticipantsNewCtrl', function ($scope, $route, $location, $routeParams, Projects) {
    'use strict';

    //set navbaractivetab
    $scope.navbaractivetab = "participants";

    $scope.getPagePartial = function () {
      return 'projects/participants/participants_new_page.tpl.html';
    };

    $scope.currentProject = Projects.getResolvedCurrentProject();

    if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
      $scope.isUserAllowedToAddParticipants = true;
    }

    //new participant object
    $scope.newparticipant = {};

    $scope.invitestates = {
      showForm: false,
      onsuccess: false,
      onerror: false,
      requestInProgress: false,
      inviteErrorType: undefined,
      noroleselected: true,
      submitted: false
    };

    $scope.openForm = function () {
      $scope.invitestates.showForm = true;
      $scope.invitestates.onsuccess = false;
      $scope.invitestates.onerror = false;
    };

    // initialize $scope.roleselectionlist
    $scope.rolesinproject = $scope.currentProject.roles;

    $scope.onRoleSelect = function (selectionresults) {
      // check if at least one role is selected when in multi select mode
      if (selectionresults.selectedroleslist.length > 0) {
        $scope.invitestates.noroleselected = false;
      } else {
        $scope.invitestates.noroleselected = true;
      }

      // 1. add entire roleslist to project
      // update roles list in current project
      $scope.currentProject.roles = selectionresults.allroleslist;

      // 2. add selected roles to first participant which will become the project owner
      $scope.newparticipant.roles = selectionresults.selectedroleslist;
    };

    $scope.inviteparticipant = {};

    $scope.inviteParticipant = function (valid) {

      // submitted.it is used in view to display messages after submit has been done
      $scope.invitestates.submitted = true;

      if (!valid || $scope.invitestates.noroleselected || $scope.invitestates.requestInProgress) {
        console.log("Cannot save form, it is not valid");
      } else {
        // invite participant
        $scope.invitestates.requestInProgress = true;

        Projects.getResolvedCurrentProject().addParticipant($scope.newparticipant)
          .then(function () {
            // save new roles to project
            return Projects.getResolvedCurrentProject().updateRoles();
          })
          .then(function () {
            $scope.navigateToParticipantsList();
          })
          .catch(function () {
            $scope.invitestates.onerror = true;
            $scope.invitestates.requestInProgress = false;
          });
      }

    };

    /**
     * Whether to show an error message for the specified error
     * @param {string} fieldName The name of the field on the form, of which we want to know whether to show the error
     * @param  {string} error - The name of the error as given by a validation directive
     * @return {Boolean} true if the error should be shown
     */
    $scope.showError = function (fieldName, error) {
      var showerror = false;
      if ($scope.valFormInvite[fieldName].$error[error] && !$scope.valFormInvite[fieldName].$pristine) {
        showerror = true;
      }
      return showerror;
    };

    $scope.canSave = function () {
      return $scope.valFormInvite.$valid;
    };

    $scope.navigateToParticipantsList = function () {
      $location.path("projects/" + $routeParams.projectid + "/participants/");
    };

  })
  .controller('ParticipantsDetailCtrl', function ($scope, $routeParams, $location, resolvedactivities, Projects) {
    'use strict';

    //set navbaractivetab
    $scope.navbaractivetab = "participants";

    $scope.getPagePartial = function () {
      return 'projects/participants/participants_detail_page.tpl.html';
    };

    $scope.navigateToParticipantsList = function () {
      $location.path("projects/" + $routeParams.projectid + "/participants/");
    };

    $scope.participant = Projects.getResolvedCurrentProject().getParticipantById($routeParams.participantid);

    //activities
    $scope.activities = resolvedactivities;
    $scope.show = {
      activities: $scope.activities.length > 0 ? true : false
    };

    $scope.currentproject = Projects.getResolvedCurrentProject();

    if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
      $scope.isUserAllowedToEditParticipant = true;
    }

  })
  .controller('ParticipantsDetailEditCompanyCtrl', function ($scope, $route, Projects) {
    'use strict';

    var orignalParticipantCompany;
    $scope.participant = Projects.getResolvedCurrentProject().getParticipantById($route.current.params.participantid);

    $scope.state = {
      requestInProgress: false,
      showeditform: false
    };

    $scope.edit = function () {
      orignalParticipantCompany = $scope.participant.company;
      if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
        $scope.state.showeditform = true;
      }
    };

    $scope.cancel = function () {
      $scope.participant.company = orignalParticipantCompany;
      $scope.state.showeditform = false;
    };

    $scope.updateCompany = function () {
      if (!$scope.state.requestInProgress) {
        $scope.state.requestInProgress = true;
        Projects.updateCompanyOfParticipant($route.current.params.projectid, $route.current.params.participantid, $scope.participant.company)
          .then(function (participant) {
            $scope.participant = participant;
            $scope.state.showeditform = false;
            $scope.state.requestInProgress = false;
          })
          .catch(function () {
            // @TODO show error message in UI
          });
      }
    };

  })
  .controller('ParticipantsDetailEditNameCtrl',
  function ($scope, $route, Projects) {
    'use strict';

    var orignalParticipantFirstName,
      orignalParticipantLastName;

    $scope.state = {
      requestInProgress: false,
      showeditform: false
    };

    $scope.participant = Projects.getResolvedCurrentProject().getParticipantById($route.current.params.participantid);

    $scope.edit = function () {
      if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
        orignalParticipantFirstName = $scope.participant.firstname;
        orignalParticipantLastName = $scope.participant.lastname;
        $scope.state.showeditform = true;
      }
    };

    $scope.cancel = function () {
      $scope.participant.firstname = orignalParticipantFirstName;
      $scope.participant.lastname = orignalParticipantLastName;
      $scope.state.showeditform = false;
    };

    $scope.updateName = function () {
      if (!$scope.state.requestInProgress) {
        $scope.state.requestInProgress = true;

        Projects.updateNameOfParticipant($route.current.params.projectid, $route.current.params.participantid, $scope.participant.firstname, $scope.participant.lastname)
          .then(function (participant) {
            $scope.participant = participant;
            $scope.state.showeditform = false;
            $scope.state.requestInProgress = false;
          })
          .catch(function () {
            // @TODO show error message in UI
          });
      }
    };

  })
  .controller('ParticipantsDetailEditRoleCtrl',
  function ($scope, $route, Projects) {
    'use strict';

    var originalParticipantsRoles,
      originalProjectRoles;
    angular.copy(Projects.getResolvedCurrentProject().getParticipantById($scope.participant._id).roles, originalParticipantsRoles);
    angular.copy(Projects.getResolvedCurrentProject().roles, originalProjectRoles);

    $scope.state = {
      showeditform: false,
      noroleselected: true,
      requestInProgress: false
    };

    $scope.onRoleSelect = function (selectionresults) {
      // check if at least one role is selected when in multi select mode
      if (selectionresults.selectedroleslist.length > 0) {
        $scope.state.noroleselected = false;
      } else {
        $scope.state.noroleselected = true;
      }

      // 1. add entire roleslist to project
      // update roles list in current project
      Projects.getResolvedCurrentProject().roles = selectionresults.allroleslist;

      // 2. add selected roles to first participant which will become the project owner
      Projects.getResolvedCurrentProject().getParticipantById($scope.participant._id).roles = selectionresults.selectedroleslist;
    };

    // @TODO implement cancel() to reset roleselector on cancel click
    $scope.rolesinproject = [];
    $scope.participantroles = [];

    $scope.edit = function () {

      $scope.debug(angular.isArray(Projects.getResolvedCurrentProject().roles));
      $scope.debug(Projects.getResolvedCurrentProject().roles);

      // initialize $scope.roleselectionlist
      angular.copy(Projects.getResolvedCurrentProject().roles, $scope.rolesinproject);
      angular.copy(Projects.getResolvedCurrentProject().getParticipantById($scope.participant._id).roles, $scope.participantroles);

      if (Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin()) {
        $scope.state.showeditform = true;
      }
    };

    $scope.cancel = function () {
      $scope.state.showeditform = false;

//      angular.copy(originalParticipantsRoles, Projects.getResolvedCurrentProject().getParticipantById($scope.participant._id).roles);
//      angular.copy(originalProjectRoles, Projects.getResolvedCurrentProject().roles);
    };

    $scope.updateRole = function () {
      if (!$scope.state.noroleselected || !$scope.state.requestInProgress) {
        $scope.state.requestInProgress = true;
        Projects.getResolvedCurrentProject().updateRolesOfParticipant($scope.participant._id)
          .then(function () {
            // save new roles to project
            return Projects.getResolvedCurrentProject().updateRoles();
          })
          .then(function () {
            $scope.state.showeditform = false;
            $scope.state.requestInProgress = false;
          })
          .catch(function () {

            // @TODO show error message in UI
            $scope.state.requestInProgress = false;
          });
      }
    };

  })
  .controller('ParticipantsDetailEditEnabledStatusCtrl',
  function ($scope, Projects, $route, currentUser) {
    'use strict';

    // currentUser must not disable himself as participant
    if ($scope.participant.user._id.toString() !== currentUser.info().id.toString()) {
      $scope.isUserAllowedToDisableUser = true;
    }

    $scope.enable = function () {
      if ((Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin() ) && $scope.isUserAllowedToDisableUser) {
        Projects.enableParticipant($route.current.params.projectid, $route.current.params.participantid)
          .then(function (participant) {
            $scope.$parent.participant = participant;
          })
          .catch(function () {
            // @TODO show error message
          });
      }
    };

    $scope.disable = function () {
      if ((Projects.getResolvedCurrentProject().isCurrentUserProjectOwner() || Projects.getResolvedCurrentProject().isCurrentUserProjectAdmin() ) && $scope.isUserAllowedToDisableUser) {
        Projects.disableParticipant($route.current.params.projectid, $route.current.params.participantid)
          .then(function (participant) {
            $scope.$parent.participant = participant;
          }).catch(function () {
            // @TODO show error message
          });
      }
    };

  });