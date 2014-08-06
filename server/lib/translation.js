var config = require('../config.js');

var Q = require('q');
var _ = require('lodash');

var googleTranslate = require('google-translate')(config.google.apikey);

var translate = function (object, sourcelanguagekey) {
  // extract languagekeys out of object keys
  var languagekeys = Object.keys(object);
  var translationPromises = [];
  _.forEach(languagekeys, function (languagekey) {
    var translationPromise = Q.ninvoke(googleTranslate, "translate", object[sourcelanguagekey], languagekey)
      .then(function (translationobject) {
        object[languagekey] = translationobject.translatedText;
      });
    translationPromises.push(translationPromise);
  });
  return translationPromises;
};

module.exports = {
  "translate": translate
};