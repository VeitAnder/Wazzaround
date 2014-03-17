'use strict';

angular.module('anorakApp')
  .controller('AllBookableItemsCtrl', function ($scope, activity) {
    console.log("ALL BOOKABLE ITEMS", activity);
    $scope.activity = activity;

  });