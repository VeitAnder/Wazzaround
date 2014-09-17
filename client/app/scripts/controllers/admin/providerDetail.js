'use strict';

angular.module('anorakApp')
    .controller('ProviderDetailCtrl', function ($scope, provider, activities) {
        $scope.getPagePartial = function () {
            return 'views/admin/providerDetail.html';
        };


        $scope.provider = provider;
        $scope.user = provider;

        $scope.activities = activities;

    });