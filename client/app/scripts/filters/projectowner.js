angular.module('projectowner', [])
  .filter('isprojectowner', function () {
    "use strict";
    return function (projects) {
      var filteredprojects = [];
      angular.forEach(projects, function (project) {
        if (project.isCurrentUserProjectOwner()) {
          filteredprojects.push(project);
        }
      });
      return filteredprojects;
    };
  })
  .filter('isnotprojectowner', function () {
    "use strict";
    return function (projects) {
      var filteredprojects = [];
      angular.forEach(projects, function (project) {
        if (!project.isCurrentUserProjectOwner()) {
          filteredprojects.push(project);
        }
      });
      return filteredprojects;
    };
  });