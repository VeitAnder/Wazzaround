'use strict';

angular.module('anorakApp')
  .directive('bookableitemlist', function ($translate, $rootScope) {
    return {
      templateUrl: 'views/directives/bookableitemlist.html',
      restrict: 'E',
      scope: {
        // scope.events = ["Quadfahren", "Segeln"]
        // scope.events[0].ref().events = Quadfahren am 1.3., am 1.4., am 1.5.
        bookableitems: '=',
        itemsperpage: '='
      },
      link: function postLink(scope, elem, attrs) {

        scope.moment = moment;
        scope.moment.lang($translate.use());
        scope.lang = $translate.use();

        // when language changes globally, reset also in directive
        $rootScope.$on('$translateChangeSuccess', function () {
          scope.moment.lang($translate.use());
          scope.lang = $translate.use();
        });

        if (!scope.itemsperpage) {
          scope.itemsperpage = scope.bookableitems.length;
        }

      }
    };
  });
