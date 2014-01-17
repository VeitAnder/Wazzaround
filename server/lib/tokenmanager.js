var Q = require('q');
var restify = require('restify');

var Accesstokens = require('../models/model_accesstokens.js');

var tokenmanager = {
  isTokenAllowedToAccessResource: function (token, resourceid) {
    var deferred = Q.defer();

    Accesstokens.findOne({
      "token": token,
      "resourceid": resourceid
    })
      .populate('user')
      .exec(function (err, accesstoken) {
        if (!err) {
          if (accesstoken) {
            deferred.resolve(accesstoken);
          } else {
            deferred.reject(new restify.errors.NotAuthorizedError("Token is invalid for this resource."));
          }
        } else {
          deferred.reject(new restify.errors.NotAuthorizedError("Could not query token collection. "));
        }
      });
    return deferred.promise;
  }
};

module.exports = tokenmanager;