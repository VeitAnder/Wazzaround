'use strict';

angular.module('anorakApp')
  .service('frontendmap', function frontendmap(basicmapdata) {

//    var mapdata = new basicmapdata().mapdata;
//
//    mapdata.map.centerMarker = {
//      title: 'Your current search location ',
//      longitude: 8.01177978515625,
//      latitude: 45.12199086176226
//    };
//
//    return mapdata;

    return new basicmapdata().mapdata;
  });