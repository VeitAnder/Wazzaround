'use strict';

/**
 * @ngdoc directive
 * @name anorakApp.directive:actionConfirmationLink
 * @description
 * # actionConfirmationLink
 */
angular.module('anorakApp')
  .directive('actionConfirmationLink', function () {
    return {
      templateUrl: 'views/directives/action-confirmation-link.html',
      restrict: 'E',
      scope: {
        action: "&",
        label: "@",
        confirmationLabel: "@",
        cancelLabel: "@",
        confirmationDescription: "@",
        isOpen: "="
      },
      link: function postLink(scope, element, attrs) {
        scope.closeActionLink = function () {
          scope.isOpen = false;
        };

        scope.openActionLink = function () {
          scope.isOpen = true;
        };
      }
    };
  });
