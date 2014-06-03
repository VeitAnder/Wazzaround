'use strict';

angular.module('anorakApp')
  .directive('languageselect', function ($translate) {
    return {
      templateUrl: 'views/directives/languageselect.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.activelanguage = $translate.use();

        scope.changeLanguage = function (langKey) {
          $translate.use(langKey);
          scope.activelanguage = $translate.use();
        };
      }
    };
  });
