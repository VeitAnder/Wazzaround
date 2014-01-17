angular.module('directives.fullname', [])
  .directive('fullname', function ($parse, Projects) {
    "use strict";

    return {
      restrict: 'A',
      templateUrl: 'directives/fullname.tpl.html',
      replace: true,
      scope: {
        user: '=',
        project: '=',
        donotlink: "@",
        alwaysshowemail: "@"
      },
      link: function (scope, elm, attrs) {
        scope.currentproject = Projects.getResolvedCurrentProject();
        scope.data = {};
        scope.data.projectid = scope.currentproject._id;
        scope.data.userid = scope.currentproject.getParticipantIdFromUserEmailAdress(scope.user.email);
        scope.data.permissioninproject = scope.currentproject.getPermissionOfUserViaEmail(scope.user.email);

        scope.$watch('project', function (value) {
          if (value) {
            scope.currentproject = value;
            scope.data.projectid = scope.currentproject._id;
            scope.data.userid = scope.currentproject.getParticipantIdFromUserEmailAdress(scope.user.email);
            scope.data.permissioninproject = scope.currentproject.getPermissionOfUserViaEmail(scope.user.email);
          }
        }, true);
      }
    };
  });
