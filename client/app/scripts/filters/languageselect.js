'use strict';

angular.module('anorakApp')
  .filter('languageselect', function ($translate) {
    return function (inputobj) {
      var translated = "";
      if (inputobj) {
        if (inputobj[$translate.use()]) {
          translated = inputobj[$translate.use()];
        } else {
          if (inputobj.en) {
            translated = inputobj.en;
          } else if (inputobj.de) {
            translated = inputobj.de;
          } else if (inputobj.it) {
            translated = inputobj.it;
          } else if (inputobj.fr) {
            translated = inputobj.fr;
          }
        }
      }
      return translated;
    };
  });
