var Q = require('q');
var mongoose = require('mongoose');
var restify = require('restify');

var acl = require('../lib/acl.js');
var Activities = require('../models/model_activities.js');
var Projects = require('../models/model_projects.js');
var Plans = require('../models/model_plans.js');

/*
 define route hanndlers
 */

exports.findAll = function (req, res, next) {
  var projectid = req.query.projectid;
  var participantid = req.query.participantid;
  var action = req.query.action;
  if (projectid && participantid) {
    acl.isUserAllowedToAccessItemInProject(req.user._id, projectid)
      .then(function () {
        //step 1 - get userid out of projectid and participantid
        var deferred = Q.defer();
        Projects.findOne(
          {
            '_id': projectid,
            participants: {
              $elemMatch: {
                '_id': participantid
              }
            }
          },
          {
            'participants.$': 1
          })
          .populate('participants.user', ' ')
          .exec(function (err, docs) {
            if (!err && docs !== null) {
              deferred.resolve(docs.participants[0].user._id);
            } else {
              deferred.reject(new restify.errors.ResourceNotFoundError("Could not find project with id" + projectid + " and participantid " + participantid));
            }
          });
        return deferred.promise;
      })
      .then(function (userid) {
        //step 2 query for activities of userid
        var deferred = Q.defer();
        Activities.find(
          {
            "projectid": projectid,
            "user": userid,
            "action": { $ne: "sendmail" }
          })
          .populate('user', 'email profile.firstName profile.lastName')
          .exec(function (err, docs) {
            if (!err && docs !== null) {
              deferred.resolve(docs);
            } else {
              deferred.reject(new restify.errors.ResourceNotFoundError("Could not get activities for project with id " + projectid + " by userid " + userid));
            }
          });
        return deferred.promise;
      })
      .then(function (activities) {
        res.send(activities);
      })
      .fail(function (err) {
        next(err);
      })
      .done();
  } else {
    //only projectid provided - get all activities of project
    // if action is provided also search for action
    acl.isUserAllowedToAccessItemInProject(req.user._id, projectid)
      .then(function () {
        var deferred = Q.defer();
        if (action && action.length > 0) {
          Activities.find(
            {
              "projectid": projectid,
              "action": action
            })
            .populate('user', 'email profile.firstName profile.lastName')
            .exec(function (err, docs) {
              if (!err && docs !== null) {
                deferred.resolve(docs);
              } else {
                deferred.reject(new restify.errors.ResourceNotFoundError("Could not find activities for project " + projectid + " and action " + action));
              }
            });
        } else {
          Activities.find(
            {
              "projectid": projectid,
              "action": { $ne: "sendmail" }
            })
            .populate('user', 'email profile.firstName profile.lastName')
            .exec(function (err, docs) {
              if (!err && docs !== null) {
                deferred.resolve(docs);
              } else {
                deferred.reject(new restify.errors.ResourceNotFoundError("Could not find activities for project " + projectid));
              }
            });
        }
        return deferred.promise;
      })
      .then(function (activities) {
        res.send(activities);
      })
      .fail(function (err) {
        next(err);
      })
      .done();
  }
};

/* Find out how often a special revision of a plan has been downloaded */
exports.getDownloadsOfPlanRevisions = function (req, res, next) {
  var planid = req.query.planid;

  Q.fcall(function () {
    if (planid) {
      return Q.resolve();
    } else {
      return Q.reject(new restify.errors.MissingParameterError("No planid in query parameters."));
    }
  })
    .then(function () {
      return Plans.findByIdQ(planid);
    })
    .then(function (plan) {
      return acl.isUserAllowedToAccessItemInProject(req.user._id, plan.projectid);
    })
    .then(function () {
      var deferred = Q.defer();

      Activities.find({
        "doc.plan._id": mongoose.Types.ObjectId(planid),
        $or: [
          { "action": "getplanrevisionpdf" },
          { "action": "getplanrevisiondwg" }
        ]
      })
        .populate('user', 'email profile.firstName profile.lastName')
        .exec(function (err, activities) {
          if (!err && activities !== null) {
            deferred.resolve(activities);
          } else {
            deferred.reject(new restify.errors.ResourceNotFoundError("Could not find activities for plan " + planid + " and action getplanrevisionpdf / dwg "));
          }
        });

      return deferred.promise;
    })
    .then(function (activities) {
      res.send(activities);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.getSentOfPlanRevisions = function (req, res, next) {
  var planid = req.query.planid;

  Plans.findByIdQ(planid)
    .then(function (plan) {
      return acl.isUserAllowedToAccessItemInProject(req.user._id, plan.projectid);
    })
    .then(function () {
      var deferred = Q.defer();

      Activities.find({
        "doc.plan._id": planid,
        "action": "sendrevision"

      })
        .populate('user', 'email profile.firstName profile.lastName')
        .exec(function (err, activities) {
          if (!err && activities !== null) {
            deferred.resolve(activities);
          } else {
            deferred.reject(new restify.errors.ResourceNotFoundError("Could not find activities for plan " + planid + " and action sendrevision "));
          }
        });
      return deferred.promise;
    })
    .then(function (activities) {
      res.send(activities);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};
