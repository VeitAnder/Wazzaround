'use strict';

angular.module('anorakApp')
    .controller('ProvidersCtrl', function ($scope, providers) {
        $scope.getPagePartial = function () {
            return 'views/admin/providers.html';
        };


        $scope.providers = providers;
    });