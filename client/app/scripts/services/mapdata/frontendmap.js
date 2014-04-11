'use strict';

angular.module('anorakApp')
  .service('frontendmap', function frontendmap(basicmapdata) {

    return new basicmapdata();
  });