'use strict';

angular.module('anorakApp')
  .directive('languagetabs', function ($translate) {
    return {
      templateUrl: 'views/directives/languagetabs.html',
      restrict: 'E',
      replace: true,
      scope: {
        formfield: "="
      },
      link: function postLink(scope, element, attrs) {
        scope.formfield = $translate.use();
        scope.changeLanguage = function (langkey) {
          scope.formfield = langkey;
        };


      }
    };
  });
