var _ = require('lodash');
var Q = require('q');
var restify = require('restify');

var Plans = require('../models/model_plans.js');
var Projects = require('../models/model_projects.js');
var acl = require('../lib/acl.js');
var activitylogger = require('../lib/activitylogger');
var s3 = require('../lib/s3.js');
var browser = require('../lib/browser.js');

exports.findAll = function (req, res, next) {
  // TODO why projectid comes here with query parameter??? should be via params id
  var projectid = req.query.projectid ? req.query.projectid :
    req.params.id ? req.params.id : "";    // TODO refactor so that all method only use one type of project id, also include in TESTS!

  if (!projectid || projectid === "") {
    next(new restify.errors.MissingParameterError("There is no projectid defined."));
  }

  acl.isUserAllowedToAccessItemInProject(req.user._id, projectid)
    .then(function () {
      return Plans.find({
        "projectid": projectid
      })
        .populate('createdby revisions.createdby', 'email profile.firstName profile.lastName profile.company profile.address')
        .execQ();
    })
    .then(function (plans) {
      res.send(plans);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.findById = function (req, res, next) {
  var foundPlan;

  Plans.findById(req.params.id)
    .populate('createdby revisions.createdby', 'email profile.firstName profile.lastName')
    .execQ()
    .then(function (plan) {
      foundPlan = plan;
      if (plan !== null) {
        return acl.isUserAllowedToAccessItemInProject(req.user._id, plan.projectid);
      } else {
        return Q.reject(new restify.errors.InternalError("Could not find plan with id " + req.params.id));
      }
    })
    .then(function () {
      res.send(foundPlan);
    })
    .fail(function (err) {
      next(err);
    });
};

exports.add = function (req, res, next) {
  var addedPlan;

  var deferred = Q.defer();
  acl.isUserAllowedToAccessItemInProject(req.user._id, req.body.projectid)
    .then(function () {
      //insert creation information
      var creationdata = {
        "modified": new Date(),
        "createdby": req.user._id,
        "created": new Date()
      };
      _.extend(req.body, creationdata);
      //revisiondata
      var revisiondata = {
        "createdby": req.user._id,
        "created": new Date(),
        "revisionindex": 0
      };
      _.extend(req.body.revisions[0], revisiondata);

      var plan = new Plans(req.body);
      plan.save(function (err, plan) {
        if (err || plan === null) {
          deferred.reject(err ? err : new restify.errors.InternalError("Could not save plan " + plan._id));
        } else {
          deferred.resolve(plan);
        }
      });
      return deferred.promise;
    })
    .then(function (plan) {
      addedPlan = plan;
      return activitylogger.log({
        "projectid": req.body.projectid,
        "action": "postplan",
        "user": req.user._id,
        "doc": addedPlan.toJSON()
      });
    })
    .then(function () {
      return Projects.updateLastRevisionUploadDate(addedPlan.projectid);
    })
    .then(function () {
      res.send(addedPlan);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updateName = function (req, res, next) {
  var updatedPlan,
    originalPlan;

  acl.isUserAllowedToAccessItemInProject(req.user._id, req.body.projectid)
    .then(function () {
      return Plans.findByIdQ(req.params.id);
    })
    .then(function (planFromDB) {
      originalPlan = planFromDB;
      return Plans.findByIdAndUpdateQ(
        req.params.id,
        {
          $set: {
            "name": req.body.name,
            "content": req.body.content,
            "modified": new Date()
          }
        });
    })
    .then(function (plan) {
      updatedPlan = plan;
      return activitylogger.log({
        "projectid": req.body.projectid,
        "action": "putplanname",
        "user": req.user._id,
        "doc": {
          "originalplan": originalPlan.toJSON(),
          "plan": updatedPlan.toJSON()
        }
      });
    })
    .then(function () {
      res.send(updatedPlan);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updatePhase = function (req, res, next) {
  var updatedPlan,
    originalPlan;

  acl.isUserAllowedToAccessItemInProject(req.user._id, req.body.projectid)
    .then(function () {
      return Plans.findByIdQ(req.params.id);
    })
    .then(function (planFromDB) {
      originalPlan = planFromDB;
      return Plans.findByIdAndUpdateQ(
        req.params.id,
        {
          $set: {
            "phasetag": req.body.phasetag,
            "modified": new Date()
          }
        });
    })
    .then(function (plan) {
      updatedPlan = plan;
      return activitylogger.log({
        "projectid": req.body.projectid,
        "action": "putplanphase",
        "user": req.user._id,
        "doc": {
          "originalplan": originalPlan.toJSON(),
          "plan": updatedPlan.toJSON()
        }
      });
    })
    .then(function () {
      res.send(updatedPlan);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.addRevision = function (req, res, next) {
  var planid = req.params.id;
  var addedrevisionindex;
  var updatedPlan;

  acl.isUserAllowedToAccessItemInProject(req.user._id, req.body.projectid)
    .then(function () {
      // get the current number of revisions of this plan
      return Plans.findByIdQ(planid);
    })
    .then(function (plan) {
      if (plan === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find plan by id " + req.params.id));
      } else {
        return Q.resolve(plan);
      }
    })
    .then(function (plan) {
      var numberofrevisions = plan.revisions.length;
      // @TODO - maybe there is a better way to pass revision than passing in at position 0 in revisions array!
      // maybe do it in the same way as in Projects.findParticipantById
      // @TODO refactor to use planSchema.methods.findPlanRevisionById
      var revisiontoadd = req.body.revisions[0];
      revisiontoadd.createdby = req.user._id;
      revisiontoadd.created = new Date();
      revisiontoadd.revisionindex = numberofrevisions;
      addedrevisionindex = revisiontoadd.revisionindex;

      return Plans.findByIdAndUpdateQ(
        planid,
        {
          $push: {
            revisions: revisiontoadd
          },
          $set: {
            "modified": new Date()
          }
        },
        {
          safe: true,
          upsert: true
        });
    })
    .then(function (plan) {
      updatedPlan = plan;

      var revisionid;
      _.each(updatedPlan.revisions, function (revision) {
        if (revision.revisionindex === addedrevisionindex) {
          revisionid = revision._id;
        }
      });

      return activitylogger.log({
        "projectid": req.body.projectid,
        "action": "postplanrevision",
        "user": req.user._id,
        "doc": {
          "plan": updatedPlan.toJSON(),
          "revisionid": revisionid
        }
      });
    })
    .then(function () {
      return Projects.updateLastRevisionUploadDate(updatedPlan.projectid);
    })
    .then(function () {
      res.send(updatedPlan);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

var getplanrevisionfile = function (req, res, filetype, next) {
  var planid = req.params.id;
  var revisionid = req.params.revisionid;
  var currentPlan;

  var filekey;
  var actionkey;

  if (filetype === "pdf_file") {
    filekey = "pdf_file";
    actionkey = "getplanrevisionpdf";
  } else if (filetype === "dwg_file") {
    filekey = "dwg_file";
    actionkey = "getplanrevisiondwg";
  }

  Plans.findOneQ({
    _id: planid
  })
    .then(function (plan) {
      if (plan === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("No plan with with id " + planid + " found"));
      } else {
        currentPlan = plan;
        return acl.isUserAllowedToDownloadPlan(req.user._id, plan.projectid);
      }
    })
    .then(function () {
      var signedDownloadUri;
      var selectedrevision = {};

      _.each(currentPlan.revisions, function (revision) {
        if (revision._id.toString() === revisionid.toString()) {
          selectedrevision = revision;
        }
      });
      if (browser.canHandleContentDisposition(req.headers['user-agent'])) {
        signedDownloadUri = s3.getSignedDownloadUrl(selectedrevision[filekey].key);
      } else {
        signedDownloadUri = s3.getSignedDownloadUrl(selectedrevision[filekey].key, true, selectedrevision[filekey].filename);
      }
      // if req.query.accesstoken -> redirect to amazon download url
      if (req.query.accesstoken) {
        res.redirect(signedDownloadUri);
      } else {
        // return json object to client
        res.send({"url": signedDownloadUri});
      }
      return Q.resolve({"plan": currentPlan.toJSON(), "revision": selectedrevision, "downloader": req.user});
    })
    .then(function (loginfo) {
      return activitylogger.log({
        "projectid": loginfo.plan.projectid,
        "action": actionkey,
        "user": req.user._id,
        "doc": loginfo
      });
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.getplanrevisionpdf = function (req, res, next) {
  getplanrevisionfile(req, res, "pdf_file", next);
};

exports.getplanrevisiondwg = function (req, res, next) {
  getplanrevisionfile(req, res, "dwg_file", next);
};
