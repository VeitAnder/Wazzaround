angular.module('directives.roleselector', [])
  .directive('roleselector', function () {
    "use strict";

    return {
      restrict: 'A',
      templateUrl: 'directives/roleselector.tpl.html',
      replace: true,
      scope: {
        rolesinproject: "=",
        participantroles: "=",
        onselect: "&",
        multiselect: "@"
      },

      link: function (scope, elem, attrs) {
        scope.states = {
          pristineform: true,
          addroleerror: false,
          noroleselected: true
        };

        scope.initializeRoleSelectionList = function () {
          scope.roleselectionlist = [];
          angular.forEach(scope.rolesinproject, function (roleinproject) {
            var currentrole = {};
            angular.copy(roleinproject, currentrole);
            currentrole.selected = false;

            //only if participantroles are defined
            if (scope.participantroles) {
              //check if currentrole is selected
              angular.forEach(scope.participantroles, function (participantrole) {
                if (participantrole.role === currentrole.role) {
                  currentrole.selected = true;
                }
              });
            }
            scope.roleselectionlist.push(currentrole);
          });
        };
        scope.initializeRoleSelectionList();

        // roles list handling
        scope.selectRole = function (role) {
          console.log("selectRole()");

          if (scope.multiselect === "false") {
            scope.deselectAllinRoleList();
            role.selected = true;
          } else {
            //enable toggle
            role.selected = !role.selected;
          }
          scope.states.addroleerror = false;
          scope.states.noroleselected = false;

          scope.onselect({
            "selectionresults": {
              "selectedroleslist": scope.getSelectedRolesList(),
              "allroleslist": scope.getAllRolesList()
            }
          });

        };

        scope.getAllRolesList = function () {
          var allroleslist = [];
          angular.forEach(scope.roleselectionlist, function (role) {
            allroleslist.push({"role": role.role});
          });
          return allroleslist;
        };

        scope.getSelectedRolesList = function () {
          var selected = [];
          angular.forEach(scope.roleselectionlist, function (role) {
            if (role.selected) {
              selected.push({"role": role.role});
            }
          });
          return selected;
        };

        scope.deselectRole = function (role) {
          role.selected = false;
        };

        scope.deselectAllinRoleList = function () {
          angular.forEach(scope.roleselectionlist, function (role, key) {
            role.selected = false;
          });
        };

        scope.addRole = function () {
          var addedrole;
          scope.states.pristineform = false;

          if (scope.canRoleBeAdded(scope.newrole)) {
            addedrole = {
              "role": scope.newrole
            };
            scope.roleselectionlist.push(addedrole);

            scope.selectRole(addedrole);

            //reset scope.newRole
            scope.newrole = "";
          }
        };

        scope.canRoleBeAdded = function (newrole) {
          var flag = true;
          // check if role is not an empty string
          if ((newrole === "" || newrole === undefined) && scope.states.noroleselected) {
            flag = false;
            scope.states.addroleerror = "empty";
          } else {
            // check if role already exists
            angular.forEach(scope.roleselectionlist, function (role, key) {
              if (role.role === newrole) {
                flag = false;
                scope.states.addroleerror = "exists";
              }
            });
            if (flag) {
              scope.states.addroleerror = false;
            }
          }
          return flag;
        };

        scope.$watch("newrole", function () {
          scope.debug("watch newrole");
          scope.canRoleBeAdded(scope.newrole);
        });

        // when rolesinproject change, re-initialize the rolesselectionlist and start over again
        scope.$watch("rolesinproject", function () {
          scope.debug("watch rolesinproject");
          scope.initializeRoleSelectionList();
        });

        // when participantroles change, re-initialize the rolesselectionlist and start over again
        scope.$watch("participantroles", function () {
          scope.debug("watch participantroles");
          scope.initializeRoleSelectionList();
        });

      } //link()
    };
  });
