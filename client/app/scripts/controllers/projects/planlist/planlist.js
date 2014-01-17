angular.module('anorakApp')
  .config(function ($routeProvider) {
    'use strict';

    $routeProvider.when('/projects/:projectid/planlist/', {
      templateUrl: 'projects/projects_basepagetemplate.tpl.html',
      controller: 'PlanlistViewCtrl',
      resolve: {
        resolveplanliste: ['Plans',
          function (Plans) {
            return Plans.getFromServer();
          }],
        resolveprojectscollection: ['Projects',
          function (Projects) {
            return Projects.resolveProjectsList();
          }]
      }
    });
  })
  .controller('PlanlistViewCtrl', function ($scope, resolveplanliste, Projects, orderByFilter, currentUser) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'projects/planlist/planlist.tpl.html';
    };

    //set navbaractivetab
    $scope.navbaractivetab = "planlist";

    $scope.plans = resolveplanliste;

    $scope.currentproject = Projects.getResolvedCurrentProject();

    $scope.planlistdata = {
      datenow: new Date()
    };

    $scope.sortedPlans = orderByFilter($scope.plans, ['+phasetag', '+name']);

    var participantId = $scope.currentproject.getParticipantIdFromUserId(currentUser.info().id);
    var participant = _.find($scope.currentproject.participants, function (participant) {
      return participant._id === participantId;
    });

    // filter plans by role of creator of the latest revision which is shown in the list
    if (participant.roles && participant.roles.length > 0) {
      $scope.filter = { roles: [participant.roles[0].role] };
    } else {
      $scope.filter = { roles: [""] };
    }

    $scope.byRole = function (plan) {

      if ($scope.filter.roles && $scope.filter.roles.length !== 0 && $scope.filter.roles[0] !== "") {
        var latestRevision = plan.getGetLatestRevision();
        if (latestRevision.creator_roles && latestRevision.creator_roles.length > 0) {
          return $scope.filter.roles[0] === latestRevision.creator_roles[0].role;
        } else {
          return false;
        }
      }
      return true;
    };

  });
