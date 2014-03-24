var config = require('../config.js');

var Q = require('q');
var _ = require('lodash');
var restify = require('restify');

var Activities = require('../models/model_activities.js');
var Projects = require('../models/model_projects.js');
var Users = require('../models/model_users.js');
var Accesstokens = require('../models/model_accesstokens.js');

var usermanager = require('../lib/usermanager.js');
var acl = require('../lib/acl.js');
var activitylogger = require('../lib/activitylogger');
var mail = require('../lib/mail.js');
var logger = require('../lib/logger.js');

/*
 define route handlers
 */

// log to activity log when user sends mails to other users, so we can store the messageID
// we might need the messageID later on if there is a bounce to notify the sender that there was a bounce
var logMailFromUserToOtherUsers = function (projectid, sender, action, messageData, projectTitle, plan, revision) {

  return activitylogger.log({
    "projectid": projectid,
    "action": action,
    "user": sender,
    "doc": messageData
  });

};

// user sends a support mail to reacture
// user will receive a copy of the text
// support will receive a mail with technical details
exports.sendSupportMail = function (req, res, next) {
  if (req.user.email !== req.body.info.user.email) {
    return next(new restify.errors.NotAuthorizedError("User id " + req.user._id + " is trying to send mail with not his own email address: " + req.body.info.user.email));
  }

  var topicText = function (text) {
    switch (text) {
      case "Fehler melden":
        return "Fehlermeldung";
      case "Wunschfunktion":
        return "Anfrage";
      case "Frage":
        return "Frage";
    }
  };

  //E-Mail Body for mail to support
  var sendSupportmessage = {
    data: {
      info: req.body.info,
      text: req.body.text,
      topic: topicText(req.body.topic),
      template: {
        supportmail: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": "support@reacture.com",
      "Subject": req.body.topic,
      "Tag": "supportmail",
      "ReplyTo": req.body.info.user.email
    }
  };

  //E-Mail Body for mail to user
  var sendUsermessage = {
    data: {
      info: req.body.info,
      text: req.body.text,
      topic: topicText(req.body.topic),
      template: {
        usercopysupportmail: true
      }
    },
    postmarkmail: {
      "From": config.postmark.from,
      "To": req.body.info.user.email,
      "Subject": req.body.topic,
      "Tag": "usercopysupportmail",
      "ReplyTo": req.body.info.user.email
    }
  };
  
  // we need two promises for the sending process and two other for returning the information we want
  var supportDone = Q.defer();
  var userCopyDone = Q.defer();
  var promises = [supportDone.promise, userCopyDone.promise];

  // first send message to support containing technical details
  var sendSupport = mail.send(sendSupportmessage).then(function (success) {
    supportDone.resolve({ mailstatus: success, reqquery: req.query, reqbody: req.body });
  }, function (error) {
    supportDone.reject(new restify.errors.InternalError("Could not send mail to support " + error.message));
  });
  promises.push(sendSupport);

  // then send the user a copy of his/her support request without the technical data
  var sendUserCopy = mail.send(sendUsermessage).then(function (success) {
    userCopyDone.resolve({ mailstatus: success, reqquery: req.query, reqbody: req.body });
  }, function (error) {
    userCopyDone.reject(new restify.errors.InternalError("Could not send copy of support request to user " + req.body.info.user.email + " " + error.message));
  });
  promises.push(sendUserCopy);

  Q.all(promises).then(function (success) {
    res.send(success);

  })
  .fail(function (err) {
    next(err);
  });

};

/*
* When a user sends a plan to newly entered email addresses, we have to check if these
* users already exists and if not create them as internal user accounts */
var checkWhichUsersAreNotInDBAndCreate = function (foundUsers, recipients) {
  var existingUsers = foundUsers.slice();
  var userMailsToCreateUsers = recipients.slice();
  var internalUsers = [];
  var usersCheckedPromises = [];
  var workOnUsers = Q.defer();

  // get non-existing users that need to be created
  // if they are already contained in the list of existingUsers, remove their emails to have an email list for new users only
  _.each(existingUsers, function (existingUser) {
    if (userMailsToCreateUsers.indexOf(existingUser.email) !== -1) {
      userMailsToCreateUsers.splice(userMailsToCreateUsers.indexOf(existingUser.email), 1);
    }
  });

  if (userMailsToCreateUsers.length > 0) {

    // now in silentUserMails are only the non-existing silent users to create
    _.each(userMailsToCreateUsers, function (silentUserEmail) {

      var deferredUserSaved = Q.defer();
      usersCheckedPromises.push(deferredUserSaved.promise);

      usermanager.createInternalAccount(silentUserEmail)
        .then(function (user) {
          internalUsers.push(user);
          deferredUserSaved.resolve();
        }, function (error) {
          deferredUserSaved.reject(new restify.errors.InternalError("Could not create internal user account for mail " + silentUserEmail + " " + error.message));
        });
    });

    Q.all(usersCheckedPromises).then(function () {
      existingUsers = existingUsers.concat(internalUsers);
      workOnUsers.resolve(existingUsers);
    });

  } else {
    workOnUsers.resolve(existingUsers);
  }
  return workOnUsers.promise;
};

/*
 * When a user sends a plan to newly entered email addresses, we have to check if these
 * users are participants of the project the plan belongs to and if not add them as silent participants */
var addUsersAsSilentParticipants = function (projectId, projectParticipants, usersToAdd) {
  var addSilentParticipants = Q.defer();

  _.each(projectParticipants, function (participant) {
    _.each(usersToAdd, function (userToStore) {
      if (userToStore.email === participant.user.email) {
        usersToAdd = _.reject(usersToAdd, function (userToAdd) {
          return userToAdd.email === participant.user.email;
        });
      }
    });
  });

  if (usersToAdd.length === 0) {
    return addSilentParticipants.resolve();
  }

  var participantObjects = [];

  _.each(usersToAdd, function (user) {
    var participant = {
      "user": user._id,
      "enabled": true,
      "permission": "silent"
    };
    participantObjects.push(participant);
  });

  Projects.updateQ({
    _id: projectId
  }, {
    $pushAll: {
      participants: participantObjects
    }
  })
    .then(function () {
      addSilentParticipants.resolve();
    })
    .fail(function (err) {
      addSilentParticipants.reject(new restify.errors.InternalError("Could not add participants to project " + projectId));
    });

  return addSilentParticipants.promise;
};

var sendPlanToOneUser = function (plan, projectTitle, sender, recipientemail, emailSendErrors) {
  var sendPlanToOneUser = Q.defer();
  var recipientAccesstoken;
  var recipientUser;

  // get user via email from database
  Users.findOneQ({
    "email": recipientemail
  })
    .then(function (user) {

      recipientUser = user;

      if (recipientUser === null) {
        sendPlanToOneUser.reject(new restify.errors.ResourceNotFoundError("Could not find user with email " + recipientemail));

      } else {

        // create accesstoken for user and sent plan
        var accesstoken = new Accesstokens({
          "resourceid": plan._id,
          "user": recipientUser._id
        });
        return accesstoken.saveQ();
      }
    })
    .then(function (accesstoken) {

      recipientAccesstoken = accesstoken;

      if (accesstoken === null) {
        sendPlanToOneUser.reject(new restify.errors.InternalError("Could not save accesstoken " + accesstoken));

      } else {

        // check which permission user has on the project
        return Projects.findOne(
          {
            '_id': plan.projectid,
            participants: {
              $elemMatch: {
                "user": recipientUser._id
              }
            }
          },
          {
            'participants.$': 1
          })
          .populate('participants.user', 'email profile.firstName profile.lastName')
          .execQ();
      }
    })
    .then(function (project) {
      if (project === null) {
        sendPlanToOneUser.reject(new restify.errors.ResourceNotFoundError("Project " + plan.projectid + " with participant " + recipientUser._id + " not found "));

      } else {

        var isNotSilent;
        if (project.participants[0].permission === "silent") {
          isNotSilent = false;
        } else {
          isNotSilent = true;
        }

        // build downloadLinks
        var downloadlinks = {
          "pdf": config.host + "api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/pdf/?accesstoken=" + recipientAccesstoken.token + "&tokenresourceid=" + plan._id,
          "dwg": config.host + "api/v1/plans/" + plan._id + "/revisions/" + plan.revisions[0]._id + "/dwg/?accesstoken=" + recipientAccesstoken.token + "&tokenresourceid=" + plan._id
        };

        return mail.sendPlan(plan, recipientemail, sender, isNotSilent, downloadlinks, projectTitle);
      }

    })
    .then(function (messageData) {
      return logMailFromUserToOtherUsers(plan.projectid, sender, "sendmail", messageData, projectTitle, plan, plan.revisions[0]);
    })
    .then(function () {
      sendPlanToOneUser.resolve();
    })
    .fail(function (err) {
      // when something goes wrong during sending we record the error in emailSendErrors to display later to the sender
      err.email = recipientemail;
      emailSendErrors.push(err);
      sendPlanToOneUser.resolve(err);
    });

  return sendPlanToOneUser.promise;
};

/* Sending plan to one or more users,
* create new internal user accounts,
* add silent participants,
* collect errors while sending */
exports.sendPlan = function (req, res, next) {
  var plan = req.body.plan;
  var usersToAdd;
  var allUsersToWorkOn;
  var emailSendErrors = [];

  // at plan.revisions[0] is then the current revision which is sent
  var checkSorted = _.sortBy(plan.revisions, function (revision) {
    return -new Date(revision.created);
  });

  plan.revisions = checkSorted;
  var recipients = req.body.recipients.slice();
  var sender = req.user.toJSON();

  acl.isUserAllowedToAccessItemInProject(req.user._id, plan.projectid)

    // get all existing users, return users if they are found
    // otherwise return error
    .then(function () {
      return Users.findQ({
        email: {
          $in: recipients
        }
      });
    })

    // read the recipients of the email to send
    // check if they already exist by comparing them with the foundUsers
    // create silent accounts for those who don't exist
    // if all users have accounts or there are no users to create, resolve
    // if there are errors in account creation reject
    .then(function (foundUsers) {
      //logger.debug("Send Plan - foundUsers: ", foundUsers);
      return checkWhichUsersAreNotInDBAndCreate(foundUsers, req.body.recipients);
    })

    // get the project by the plan.projectid
    // check the project's participants and add all users that are not already there as participants
    // then save the project
    .then(function (users) {
      usersToAdd = users.slice();
      allUsersToWorkOn = users;

      return Projects.findOne({
        _id: plan.projectid
      })
        .populate('participants.user', 'email profile.firstName profile.lastName')
        .execQ();
    })

    // check which users are to be added to the project as silent participants
    .then(function (project) {

      if (project === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Error in retrieving project " + plan.projectid));
      }
      return addUsersAsSilentParticipants(plan.projectid, project.participants, usersToAdd);
    })

// now send emails to all recipients
// return ok if email sending works, error otherwise
    .then(function () {
      var recipients = req.body.recipients;
      var everyPlanIsSent = Q.defer();
      var sendPlanToAllUsersPromiseList = [];

      // send a plan to each recipient and collect errors while sending if there are some
      _.each(recipients, function (recipientemail) {
        sendPlanToAllUsersPromiseList.push(sendPlanToOneUser(plan, req.body.projectTitle, req.user, recipientemail, emailSendErrors));
      });

      Q.all(sendPlanToAllUsersPromiseList)
        .then(function () {

          //all emails are sent, all errors are stored. If there are only errors, reject
          if (emailSendErrors.length === sendPlanToAllUsersPromiseList.length) {
            everyPlanIsSent.reject(new restify.errors.InternalError("All messages could not be sent"));

          } else {
            everyPlanIsSent.resolve();
          }

        })
        .fail(function (err) {
          everyPlanIsSent.reject(err);
        });

      return everyPlanIsSent.promise;
    })

    // logging
    .then(function () {
      // @TODO: refactor securing user data into node_module
      var secureUsers = [];
      // remove passwords keys from users array
      _.each(allUsersToWorkOn, function (user) {
        if (user._id && !(_.find(emailSendErrors, function (invalidUser) {
          return invalidUser.email === user.email;
        }))) {

          secureUsers.push({
            "_id": user._id,
            "email": user.email,
            "profile": user.profile
          });
        }
      });

      var doc = {
        recipients: secureUsers,
        plan: plan,
        revision: plan.revisions[0],
        sendErrors: emailSendErrors
      };

      return activitylogger.log({
        "projectid": plan.projectid,
        "action": "sendrevision",
        "user": req.user._id,
        "doc": doc
      });
    })

    // get all activities for sending and return them because they need to be displayed in the page
    // return ok if activities list can be retrieved, error otherwise
    .then(function () {
      return Activities.findQ({
        "doc.plan._id": plan._id,
        "action": "sendrevision"
      });
    })

    // send back the list of activities or error
    .then(function (activities) {
      if (activities === null) {
        return Q.reject(new restify.errors.ResourceNotFoundError("Could not find sendrevision activities for plan " + plan._id));
      }

      res.send(activities);

    })
    .fail(function (err) {
      logger.error("Error in sending plan " + plan._id + " by user " + req.user.email, err);
      next(err);
    })
    .done();
};

// Postmark gives us reasons why there was a bounce, write them to email
var translateBouncereason = function (bounceType) {

  switch (bounceType) {
    case "HardBounce":
      return "Diese Emailadresse existiert nicht. Sie wird gesperrt und man kann keine Emails mehr an sie verschicken.";
    case "Transient":
      return "Es gibt Probleme mit dem Mailserver des Empfängers.";
    case "Unsubscribe":
      return "Der Empfänger will keine Emails mehr bekommen.";
    //case "Subscribe":
    //  return "";
    case "AutoResponder":
      return "Der/die Empfänger/in hat seine Emailadresse auf out-of-office gestellt und ist gerade nicht da.";
    //case "AddressChange":
    //  return "";
    case "DnsError":
      return "Es gibt Probleme mit dem Mailserver des Empfängers.";
    case "SpamNotification":
      return "Der Mailserver des Empfängers hält das Email für Spam.";
    //case "OpenRelayTest":
    //  return "";
    case "Unknown":
      return "Es gab einen Fehler beim Versenden.";
    case "SoftBounce":
      return "Die Mailbox ist voll";
    //case "VirusNotification":
    //  return "";
    case "ChallengeVerification":
      return "Es gab eine Retourmail mit einer Bestätigungsanfrage.";
    //case "BadEmailAddress":
    //  return "";
    case "SpamComplaint":
      return "Der Mailserver des Empfängers hält das Email für Spam.";
    //case "ManuallyDeactivated":
    //  return "";
    //case "Unconfirmed":
    //  return "";
    //case "Blocked":
    //  return "";
    //case "InboundError":
    //  return "";
    default:
      return "Es gab einen Fehler beim Versenden.";
  }

};

// When there is a bounce from Postmark it will land here
exports.handleBounce = function (req, res, user, next) {

  logger.info("BOUNCE", req.body);
  try {

    // each message has a messageID which is stored in Postmark and in our activity log
    var msgId = req.body.MessageID;

    // retrieve message sender from activity log by querying it via MessageId
    Activities.find({
      "action": "sendmail",
      "doc.MessageID": msgId
    })

      .populate('user', 'email profile.firstName profile.lastName')
      .exec(function (err, activities) {
        logger.info("activities list", activities[0]);
        logger.info("user in list", activities[0] ? activities[0].user : "");

        // we have no activities, so we cant read sender or we have an error
        if (!activities || activities.length === 0 || !activities[0] || !activities[0].user || err) {
          if (err) {
            Q.reject(err);
          } else {
            Q.reject(new restify.errors.ResourceNotFoundError("Error in finding 'sendmail' activities for user " + user.email));
          }
        }

        //E-Mail to sender that something went wrong
        var sendmessage = {
          data: {
            user: activities[0].user && activities[0].user.email ? activities[0].user.email : activities[0].user,
            receiver: activities[0].doc.To,
            reason: translateBouncereason(req.body.Type),
            template: {
              mailbounce: true
            }
          },
          postmarkmail: {
            "From": config.postmark.from,
            "To": activities[0].user.email,
            "Subject": "Mail konnte nicht zugestellt werden",
            "Tag": "mailbounce",
            "ReplyTo": config.postmark.replyto
          }
        };

        // http://spamcheck.postmarkapp.com/filter

        mail.send(sendmessage).then(function () {
          return activitylogger.log({
            "projectid": activities[0].projectid,
            "action": "sendmail",
            "user": activities[0].user._id,
            "doc": sendmessage
          })
            .then(function () {

              logger.info("Sent bounce information success");
              res.send(200);

            });

        }, function (err) {
          logger.error("Could not send bounce information", sendmessage, err);
          next(err);
        });
      });

  } catch (error) {
    logger.error("Could not send bounce information because error happened before", error);
    next(error);
  }

};

