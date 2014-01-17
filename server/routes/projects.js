var _ = require('lodash');
var Q = require('q');
var restify = require('restify');

var mail = require('../lib/mail.js');
var acl = require('../lib/acl.js');
var activitylogger = require('../lib/activitylogger');
var Projects = require('../models/model_projects.js');
var Users = require('../models/model_users.js');
var usermanager = require('../lib/usermanager.js');
var logger = require('../lib/logger.js');

exports.newprojectmodel = function (req, res, next) {
  acl.isUserPlanfredUser(req.user._id)
    .then(function () {
      var newproject = new Projects({
        "roles": [
          { "role": "Bauherr"  },
          { "role": "Architekt"  },
          { "role": "Statiker"  },
          { "role": "HKLS" } ,
          { "role": "Elektro" }
        ]
      });
      res.send(newproject);
    })
    .fail(function (err) {
      next(err);
    });
};

exports.findAll = function (req, res, next) {
  Projects.find({
      "participants": {
        $elemMatch: {
          "user": req.user._id,
          "enabled": true,
          // allow only projects in which the user is admin, owner or participant, not silent!
          $or: [
            { "permission": "admin" },
            { "permission": "owner" },
            { "permission": "participant" }
          ]
        }
      }
    }
  )
    .populate('participants.user', 'email profile.firstName profile.lastName lastlogindate alreadyloggedin')
    .execQ()
    .then(function (doc) {
      res.send(doc);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.findById = function (req, res, next) {
  acl.isUserAllowedToAccessItemInProject(req.user._id, req.params.id)
    .then(function () {
      return Projects.findOne({
        _id: req.params.id,
        participants: {
          $elemMatch: {
            "user": req.user._id,
            "enabled": true,
            $or: [
              { "permission": "admin" },
              { "permission": "owner" },
              { "permission": "participant" }
            ]
          }
        }
      })
        .populate('participants.user', 'email profile.firstName profile.lastName')
        .execQ();
    })
    .then(function (doc) {
      res.send(doc);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.add = function (req, res, next) {
  var addedProject;
  var ownersrolelist = req.body.participants[0].roles;
  // TODO maybe send roles extra, because participant is generated here, see line 117
  // TODO it is also ugly, that roles are fetched from a participant on a fixed number in an array, better send roles extra
  // TODO or only accept projects that contain a participant

  acl.isUserPlanfredUser(req.user._id)
    .then(function () {
      var deferred = Q.defer();
      //set creator as projectOwner
      var projectdata = _.extend(req.body, {
        "participants": [
          {
            "user": req.user._id,
            "permission": "owner",
            "firstname": req.user.profile.firstName,
            "lastname": req.user.profile.lastName,
            "company": req.user.profile.company,
            "roles": ownersrolelist
          }
        ]
      });

      // @TODO refactor deletes into some more generic safety rules
      delete projectdata.created;
      delete projectdata.modified;
      delete projectdata.phasetags;
      delete projectdata.lastrevisionupload;

      // validate new project
      var newproject = new Projects(projectdata);
      newproject.validate(function (err) {
        if (err) {
          deferred.reject(new restify.errors.InvalidContentError("Could not validate the new project of user " + req.user._id));
        } else {
          deferred.resolve(newproject);
        }
      });
      return deferred.promise;
    })
    .then(function (newproject) {
      // save validated project
      return newproject.saveQ();
    })
    .then(function (savedproject) {
      addedProject = savedproject;
      logger.debug('Update firstproject date in User ', req.user._id);
      return Users.updateFirstProjectDate(req.user._id);
    })
    .then(function () {  // Neue Projekt wurde in der Datenbank hinzugefügt
      logger.debug('Added new project to Database');
      return activitylogger.log({
        "projectid": addedProject._id,
        "action": "postproject",
        "user": req.user._id,
        "doc": addedProject.toJSON()
      });
    })
    .then(function () {
      res.send(addedProject);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updateTitle = function (req, res, next) {
  var currentProject;

  acl.isUserProjectAdminOrProjectOwner(req.user._id, req.params.id)
    .then(function () {
      var deferred = Q.defer();
      //@TODO more elegant way of validating title - eg. via mongoose schema
      if (!req.body.title) {
        deferred.reject(new restify.errors.MissingParameterError("There is no title for project title update provided."));
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    })
    .then(function () {
      return Projects.findByIdAndUpdateQ(
        req.params.id,
        {
          "title": req.body.title
        });
    })
    .then(function (project) {
      if (project === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find project " + req.params.id));
      }
      return Q.resolve(project);
    })
    .then(function (project) {
      currentProject = project;
      //log activity
      return activitylogger.log({
        "projectid": req.params.id,
        "action": "putprojecttitle",
        "user": req.user._id,
        "doc": currentProject.toJSON()
      });
    })
    .then(function () {
      res.send(currentProject);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

//secure
exports.findAllParticipants = function (req, res, next) {
  acl.isUserAllowedToAccessItemInProject(req.user._id, req.params.id)
    .then(function () {
      return Projects.findOne({
        _id: req.params.id
      })
        .populate('participants.user', 'email profile.firstName profile.lastName')
        .execQ();
    })
    .then(function (project) {
      if (project === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find project with id " + req.params.id));
      }
      return Q.resolve(project.participants);
    })
    .then(function (participants) {
      res.send(participants);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

var findParticipantById = function (projectid, participantid) {
  var deferred = Q.defer();
  Projects.findOne(
    {
      '_id': projectid,
      'participants._id': participantid
    },
    {
      'participants.$': 1
    })
    .populate('participants.user ', 'email profile.firstName profile.lastName lastlogindate alreadyloggedin')
    .exec(function (err, doc) {
      if (!err && doc !== null) {
        deferred.resolve(doc.participants[0]);
      }
      else {
        deferred.reject(new restify.errors.ResourceNotFoundError("Could not find participant by id " + participantid + " in project " + projectid));
      }
    });

  return deferred.promise;
};

exports.findParticipantById = function (req, res, next) {
  var projectid = req.params.id;
  var participantid = req.params.participantid;

  acl.isUserAllowedToAccessItemInProject(req.user._id, req.params.id)
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (doc) {
      res.send(doc);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

/*
 invite via email,
 1) check if useraccount with login already exists. if yes, then send you are invited email and it is done.
 2) check if silent account already exists (could be done with usermanager.createSilentAccount), if yes use this by
 creating a login useraccount and send login credentials to the user email
 */
exports.addParticipant = function (req, res, next) {
  var projectid = req.params.id;
  var invitee = req.body;

  var participant;
  var userAccountOfParticipant;

  var currentProjectInstance;

  //check if user is allowed to invite participants in this project - only projectowner is allowed to invite participants
  acl.isUserProjectAdminOrProjectOwner(req.user._id, projectid)
    .then(function () {
      return Projects.findByIdQ(projectid);
    })
    .then(function (selectedProjectData) {
      currentProjectInstance = new Projects(selectedProjectData);
      return Q.resolve();
    })
    .then(function () {
      logger.debug("User is Admin or Project owner. Get now user Account for this E-Mail:", req.user.email, "" + req.user._id);  // this is the admin/owner user
      //access granted
      return usermanager.getAccount(invitee.email);
    })
    .then(function (accountResult) {
      logger.debug("create an new user login account if there is no user for this email", invitee.email);

      //check for account upgrade or new account creation or existing login account
      if (accountResult === null) {
        //no user available, createLoginAccount
        return usermanager.createLoginAccount({email: invitee.email});
      } else {
        return Q.resolve(accountResult);
      }
    })
    .then(function (userAccount) {
      userAccountOfParticipant = userAccount;

      // Fill the participant schema
      participant = {
        "user": userAccount._id,
        "roles": invitee.roles,
        "company": invitee.company,
        "firstname": invitee.firstname,
        "lastname": invitee.lastname,
        "permission": "participant",
        "enabled": true
      };

      return Projects.addParticipant(projectid, participant);
    })
    .then(function (project) {
      var newpassword;

      if (!userAccountOfParticipant.accountconfirmed) {
        logger.debug("User account is not confirmed yet - set new password and send email with password", userAccountOfParticipant.email);
        newpassword = usermanager.generatePassword();
        return usermanager.setPassword(userAccountOfParticipant.email, newpassword)
          .then(function () {
            logger.debug("Send invitation e-mail to unconfirmed user account");
            return mail.sendProjectInvitationMailToUnconfirmedAccount(req.user, userAccountOfParticipant, project, newpassword);
          });
      } else {
        logger.debug("User account is already confirmed - userAccountOfParticipant", userAccountOfParticipant);
        return mail.sendProjectInvitationMailToAlreadyConfirmedAccount(req.user, userAccountOfParticipant, project);
      }

    })
    .then(function () {
      logger.debug("Log to activities that the user has been added to the project");
      var loguser = {
        _id: userAccountOfParticipant._id,
        email: userAccountOfParticipant.email
      };

      //log that user was invited to the project
      return activitylogger.log({
        "projectid": projectid,
        "action": "postprojectinvitation",
        "user": req.user._id,
        "doc": loguser
      });
    })
    .then(function () {
      res.send({message: userAccountOfParticipant.email + " invited."});
    })
    .fail(function (err) {
      logger.error("addParticipant promise chain failed!", err);
      next(err);
    });

};

exports.changeEnabledStateOfParticipant = function (req, res, next) {
  var projectid = req.params.id;
  var participantid = req.params.participantid;
  var enabled = req.body.enabled;
  var updatedParticipant;

  acl.isUserProjectAdminOrProjectOwner(req.user._id, projectid)
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (participantToBeChanged) {
      var deferred = Q.defer();

      if (participantToBeChanged === null) {
        deferred.reject(new restify.errors.ResourceNotFoundError("Could not find participantToBeChanged " + participantid + " in project " + projectid));
      } else {
        // participantToBeChanged must not disable himself
        if (participantToBeChanged.user._id.toString() === req.user._id.toString()) {
          deferred.reject(new restify.errors.NotAuthorizedError("User " + req.user._id + " can't disable himself as participantToBeChanged"));
        // participantToBeChanged is not disabling himself, so check if it's not the owner
        } else if(participantToBeChanged.permission === "owner") {
          Projects.findOne(
            {
              '_id': projectid,
              participants: {
                $elemMatch: {
                  "user": req.user._id
                }
              }
            },
            {
              'participants.$': 1
            })
            .populate('participants.user')
            .exec(function (err, projectWithParticipantWhoWantsToChangeEnabledState) {
              if(projectWithParticipantWhoWantsToChangeEnabledState.participants[0].permission === "admin" && participantToBeChanged.permission === "owner") {
                deferred.reject(new restify.errors.NotAuthorizedError("User " + req.user._id + " is an admin and cannot disable an owner of the project"));
              } else {
                deferred.resolve();
              }
            });
        }
        else {
          deferred.resolve();
        }
      }
      return deferred.promise;
    })
    .then(function () {
      return Projects.updateQ(
        {
          '_id': projectid,
          'participants._id': participantid
        },
        {
          $set: {
            'participants.$.enabled': enabled
          }
        });
    })
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (updatedParticipantFromDB) {
      updatedParticipant = updatedParticipantFromDB;
      //log activity enabled/disabled
      return activitylogger.log({
        "projectid": projectid,
        "action": "putprojectparticipantenabled",
        "user": req.user._id,
        "doc": updatedParticipant.toJSON()
      });
    })
    .then(function () {
      res.send(updatedParticipant);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updateCompanyOfParticipant = function (req, res, next) {
  var projectid = req.params.id;
  var participantid = req.params.participantid;
  var company = req.body.company;
  var updatedParticipant;

  acl.isUserProjectAdminOrProjectOwner(req.user._id, projectid)
    .then(function () {
      return Projects.updateQ(
        {
          '_id': projectid,
          'participants._id': participantid
        },
        {
          $set: {
            'participants.$.company': company
          }
        });
    })
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (participantFromDB) {
      //log activity enabled/disabled
      updatedParticipant = participantFromDB;

      return activitylogger.log({
        "projectid": projectid,
        "action": "putparticipantcompany",
        "user": req.user._id,
        "doc": updatedParticipant.toJSON()
      });
    })
    .then(function () {
      res.send(updatedParticipant);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updateNameOfParticipant = function (req, res, next) {
  var projectid = req.params.id;
  var participantid = req.params.participantid;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var updatedParticipant;

  acl.isUserProjectAdminOrProjectOwner(req.user._id, projectid)
    .then(function () {
      return Projects.updateQ(
        {
          '_id': projectid,
          'participants._id': participantid
        },
        {
          $set: {
            'participants.$.firstname': firstname,
            'participants.$.lastname': lastname
          }
        });
    })
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (participantFromDB) {
      //log activity enabled/disabled
      updatedParticipant = participantFromDB;

      return activitylogger.log({
        "projectid": projectid,
        "action": "putparticipantname",
        "user": req.user._id,
        "doc": updatedParticipant.toJSON()
      });
    })
    .then(function () {
      res.send(updatedParticipant);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

exports.updateRolesOfParticipant = function (req, res, next) {
  var projectid = req.params.id;
  var participantid = req.params.participantid;
  var updatedParticipant;

  acl.isUserProjectAdminOrProjectOwner(req.user._id, projectid)
    .then(function () {
      // instantiate Project out of req.body and find the participant
      var project = new Projects(req.body);
      return project.findParticipantById(participantid);
    })
    .then(function (participant) {
      return Projects.updateQ(
        {
          '_id': projectid,
          'participants._id': participantid
        },
        {
          $set: {
            'participants.$.roles': participant.roles
          }
        });
    })
    .then(function () {
      return findParticipantById(projectid, participantid);
    })
    .then(function (participant) {
      updatedParticipant = participant;
      return activitylogger.log({
        "projectid": projectid,
        "action": "putparticipantrole",
        "user": req.user._id,
        "doc": participant.toJSON()
      });
    })
    .then(function () {
      return Projects.findOneQ({
        _id: projectid
      });
    })
    .then(function (project) {
      if (project === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find project " + projectid));
      } else {
        return Q.resolve(project);
      }
    })
    .then(function (project) {
      res.send(project);
    })
    .fail(function (err) {
      next(err);
    })
    .done();
};

// Add roles to project, happens if a participant is assigned a role
exports.updateRoles = function (req, res, next) {
  var allPlusNewRoles = req.body.roles;
  var userId = req.user._id;
  var projectid = req.params.id;
  var newRoles = [];
  var updatedProject;

  // check if user may access project
  // addToSet adds role only if its not part of set yet, so we have no double roles
  acl.isUserProjectAdminOrProjectOwner(userId, projectid)
    .then(function () {
      return Projects.findOneQ({
        _id: projectid
      });
    })
    .then(function (project) {
      if (project === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find project with id " + projectid));
      }
      // we need the new roles for the activity log
      var allPlusNewRolesStrings = [];
      for (var i = 0; i < allPlusNewRoles.length; i++) {
        allPlusNewRolesStrings.push(allPlusNewRoles[i].role);
      }

      var projectRolesStrings = [];
      for (var j = 0; j < project.roles.length; j++) {
        projectRolesStrings.push(project.roles[j].role);
      }
      newRoles = _.difference(allPlusNewRolesStrings, projectRolesStrings);
      for (var k = 0; k < newRoles.length; k++) {
        newRoles[k] = { role: newRoles[k] };
      }

      if (newRoles.length > 0) {
        //participant not added to project yet, do it now
        return Projects.updateQ({
          _id: projectid
        }, {
          // addToSet adds roles only if they are not contained in project.roles
          $addToSet: {
            roles: {
              $each: newRoles
            }
          }
        });
      } else {
        // no new roles to add - just resolve
        Q.resolve();
      }

    })
    .then(function () {
      // retrieve project for logging
      return Projects.findOneQ({
        _id: projectid
      });
    })
    // log postrole
    .then(function (project) {
      updatedProject = project;
      // only log if newRoles where added
      if (newRoles.length > 0) {
        return activitylogger.log({
          "projectid": projectid,
          "action": "postrole",
          "user": userId,
          "doc": {
            "project": updatedProject,
            "newroles": newRoles
          }
        });
      }
    })
    // send back project with new role
    .then(function () {
      res.send(updatedProject);
    })
    .fail(function (error) {
      next(error);
    })
    .done();
};