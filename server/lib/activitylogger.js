var Q = require('q');

var Activities = require('../models/model_activities.js');

var activitylogger = {
  log: function (activitydata) {
    var deferred = Q.defer();
    var activitytosave = new Activities(activitydata);
    activitytosave.save(function (err, doc) {
      if (err || doc === null) {
        deferred.reject(err);
      } else {
        deferred.resolve(doc);
      }
    });
    return deferred.promise;
  }
};

module.exports = activitylogger;