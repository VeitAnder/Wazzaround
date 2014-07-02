'use strict';

angular.module('anorakApp')
  .factory('translationutils', function translationutils($translate) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      // service to determine available language in case of ng-model binding in view
      getAvailableTranslationLanguageKey: function (multilanguageobject) {
        var availablelangkey = "";
        if (multilanguageobject[$translate.use()]) {
          availablelangkey = $translate.use();
        } else {
          if (multilanguageobject.en) {
            availablelangkey = "en";
          } else if (multilanguageobject.de) {
            availablelangkey = "de";
          } else if (multilanguageobject.it) {
            availablelangkey = "it";
          }
        }
        return availablelangkey;
      }
    };

  });
