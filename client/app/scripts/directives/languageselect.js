'use strict';

angular.module('anorakApp')
  .directive('languageselect', function ($translate) {
    return {
      templateUrl: 'directives/languageselect.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.changeLanguage = function (langKey) {
          $translate.use(langKey);
        };
      }
    };
  });
