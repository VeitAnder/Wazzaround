angular.module('anorakApp')
  .config(
  function ($routeProvider) {
    'use strict';

    $routeProvider.when('/projects/:projectid/activities/', {
      templateUrl: 'projects/projects_basepagetemplate.tpl.html',
      controller: 'ActivitiesViewCtrl',
      resolve: {
        resolvedactivities: ['$route', 'Activities',
          function ($route, Activities) {
            return Activities.getAllFromProject($route.current.params.projectid);
          }],
        resolveprojectscollection: ['Projects',
          function (Projects) {
            return Projects.resolveProjectsList();
          }]
      }
    });
  })
  .controller('ActivitiesViewCtrl', function ($scope, $location, $routeParams, resolvedactivities, Activities, Projects) {
    'use strict';

    $scope.getPagePartial = function () {
      return 'projects/activities/activities.tpl.html';
    };

    //set navbaractivetab
    $scope.navbaractivetab = "activities";

    $scope.activities = resolvedactivities;

    $scope.currentproject = Projects.getResolvedCurrentProject();

  });