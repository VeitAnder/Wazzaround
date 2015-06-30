'use strict';

angular.module('anorakApp')
  .service('activitybackendmap', function activitybackendmap(basicmapdata) {
    return new basicmapdata();
  });