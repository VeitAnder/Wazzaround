angular.module('filename', []).
  filter('filetypeending',function () {
    "use strict";

    return function (filename) {
      if (filename !== undefined){
        return filename.split('.').pop();
      }
    };
  });