'use strict';

angular.module('anorakApp')
  .directive('languageselect', function ($translate, $timeout, $rootScope) {
    return {
      templateUrl: 'views/directives/languageselect.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.activelanguage = $translate.use();

        scope.changeLanguage = function (langKey) {
          $translate.use(langKey)
            .then(function () {
              $timeout(function () {
                scope.activelanguage = $translate.use();
              });
            });
        };

        // listen to translateChangeSuccess and change scope.activelanguage
        // necessary if languageselect is used multiple times on one page, eg. activity edit page
        $rootScope.$on('$translateChangeSuccess', function () {
          $timeout(function () {
            scope.activelanguage = $translate.use();
          });
        });
      }
    };
  });
