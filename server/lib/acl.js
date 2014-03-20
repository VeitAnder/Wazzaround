var Q = require('q');
var restify = require('restify');

var Projects = require('../models/model_projects.js');
var Users = require('../models/model_users.js');

var logger=require('../lib/logger.js');

exports.isUserAllowedToAccessItemInProject = function (userid, itemprojectid) {
  var deferred = Q.defer();

  Projects.findOne({
    _id: itemprojectid,
    participants: {
      $elemMatch: {
        "user": userid,
        "enabled": true,
        $or: [
          { "permission": "admin" },
          { "permission": "owner" },
          { "permission": "participant" }
        ]
      }
    }
  }, function (err, project) {
    if (!err && project !== null) {
      deferred.resolve();
    } else {
      deferred.reject(new restify.errors.NotAuthorizedError("User " + userid + " is not allowed to access this resource " + itemprojectid + "Err:" + err));
    }
  });

  return deferred.promise;
};

exports.isUserAllowedToDownloadPlan = function (userid, itemprojectid) {
  var deferred = Q.defer();

  Projects.findOne({
    _id: itemprojectid,
    participants: {
      $elemMatch: {
        "user": userid,
        "enabled": true,
        $or: [
          { "permission": "admin" },
          { "permission": "owner" },
          { "permission": "participant" },
          { "permission": "silent" }
        ]
      }
    }
  }, function (err, project) {
    if (!err && project !== null) {
      deferred.resolve();
    } else {
      deferred.reject(new restify.errors.NotAuthorizedError("Error while testing user access for " + userid + "Err: " + err));
    }
  });

  return deferred.promise;
};

exports.isUserProjectOwner = function (userid, projectid) {
  return Projects.findOneQ({
    _id: projectid,
    participants: {
      $elemMatch: {
        "user": userid,
        "permission": "owner",
        "enabled": true
      }
    }
  }).then(function (project) {
      if (project !== null) {
        return Q.resolve();
      } else {
        return Q.reject(new restify.errors.NotAuthorizedError("User " + userid + " is not owner of this project " + projectid));
      }
    })
    .fail(function (err) {
      return Q.reject(new restify.erros.NotAuthorizedError("Error while testing user access for " + userid + " on project " + projectid + "Err: " + err));
    });
};

exports.isUserProjectAdmin = function (userid, projectid) {
  return Projects.findOneQ({
    _id: projectid,
    participants: {
      $elemMatch: {
        "user": userid,
        "permission": "admin",
        "enabled": true
      }
    }
  }).then(function (project) {
      if (project !== null) {
        return Q.resolve();
      } else {
        return Q.reject(new restify.errors.NotAuthorizedError("User " + userid + " is not admin of this project"));
      }
    })
    .fail(function (err) {
      return Q.reject(new restify.erros.NotAuthorizedError("Error while testing user access for " + userid + "Err: " + err));
    });
};

exports.isUserProjectAdminOrProjectOwner = function (userid, projectid) {
  logger.debug("Try to resolve wether the user is a admin or project owner");
  return Projects.findOneQ({
    _id: projectid,
    participants: {
      $elemMatch: {
        "user": userid,
        $or: [
          { "permission": "admin" },
          { "permission": "owner" }
        ],
        "enabled": true  // the user account is disabled (for this project)
      }
    }
  })
    .then(function (project) {
      if (project === null) {
        return Q.reject(new restify.errors.NotAuthorizedError("User " + userid + " is neither owner nor admin of this project"));
      } else {
        logger.debug("The user is admin or project owner for the project: ", project.title);
        return Q.resolve();
      }
    })
   .fail(function (err) {
      return Q.reject(new restify.errors.NotAuthorizedError("Error while testing user access for " + userid + " (Err: " + err + ")"));
    });
};
