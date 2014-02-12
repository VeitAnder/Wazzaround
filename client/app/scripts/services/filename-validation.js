angular.module('services.filenameValidation', [])
  .factory('FilenameValidationService', function (debug) {
    "use strict";

    var charsAllowed = /[^A-Za-zÄÖÜäöüß0-9-_.\(\)\[\]\s]/g;

    var service = {

      // on some platforms encoding comes out wrong
      encodeSpecialChars: function (fileName) {
        return fileName.replace(/a\u0308/g, 'ä')
          .replace(/o\u0308/g, 'ö')
          .replace(/u\u0308/g, 'ü')
          .replace(/A\u0308/g, 'Ä')
          .replace(/O\u0308/g, 'Ö')
          .replace(/U\u0308/g, 'Ü');
        // TODO  replace every new char that comes through here, e.g. French, Swedish, ... chars
        // Mac separates the "special" sign from the letter
      },

      // if filename contains chars that are forbidden in Windows or #, validate as false
      validateFileName: function validateFileName(fileName) {
        //debug("FILENAME", fileName, encodeURIComponent(fileName));  Encoding shows which signs are used
        fileName = service.encodeSpecialChars(fileName);
        //debug("FILENAME NOW", fileName, encodeURIComponent(fileName));  Encoding shows which signs are used

        var forbiddenInWin = /[;,/?:@&=+$#"*]/g;
        var forbidden = forbiddenInWin.exec(fileName);
        if (forbidden && forbidden.length > 0) {
          return forbidden;
        }

        var notPartOfLanguageDef = charsAllowed.exec(fileName);
        debug("Non standard sign found", notPartOfLanguageDef);
        return notPartOfLanguageDef ? ["other"] : [];
      }
    };

    return service;

  });
