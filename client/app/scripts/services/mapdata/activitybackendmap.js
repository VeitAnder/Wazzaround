'use strict';

angular.module('anorakApp')
  .service('activitybackendmap', function activitybackendmap(basicmapdata, $rootScope) {
    return new basicmapdata();
  });