'use strict';

angular.module('anorakApp')
  .directive('languagetabs', function ($translate) {
    return {
      templateUrl: 'views/directives/languagetabs.html',
      restrict: 'E',
      scope: {
        formfieldlanguage: "="
      },
      link: function postLink(scope, element, attrs) {
        scope.formfieldlanguage = $translate.use();
        scope.changeLanguage = function (langkey) {
          scope.formfieldlanguage = langkey;
        };
      }
    };
  });
