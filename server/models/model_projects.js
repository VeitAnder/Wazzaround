var Q = require('q');
var mongoose = require('mongoose-q')();
var restify = require('restify');
var _ = require('lodash');

var logger = require('../lib/logger.js');

// checkout http://mongoosejs.com/docs/subdocs.html for understanding subdocs

//ROLE SCHEMA
var roleSchema = new mongoose.Schema({
  "role": { type: String }
}, {
  _id: false
});

//PARTICIPANT SCHEMA
var participantSchema = new mongoose.Schema({
  "user": { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  "roles": { type: Array },
  "company": { type: String },
  "firstname": { type: String },
  "lastname": { type: String },
  "enabled": { type: Boolean, "default": true },
  "permission": { type: String, enum: ["owner", "admin", "participant", "silent"], "default": "participant" }
});

//PROJECT SCHEMA
var projectSchema = new mongoose.Schema({
  "title": { type: String, required: true, trim: true },
  "participants": [participantSchema],
  "created": { type: Date, "default": Date.now },
  "modified": { type: Date, "default": Date.now },
  "lastrevisionupload": { type: Date },
  "roles": [roleSchema],
  "phasetags": {
    "at": {
      "type": Array,
      "default": [
        {
          "label": "Vorentwurfsplan",
          "plural": "Vorentwurfspläne"
        },
        {
          "label": "Entwurfsplan",
          "plural": "Entwurfspläne"
        },
        {
          "label": "Einreichplan",
          "plural": "Einreichpläne"
        },
        {
          "label": "Ausführungsplan",
          "plural": "Ausführungspläne"
        },
        {
          "label": "Detailplan",
          "plural": "Detailpläne"
        },
        {
          "label": "Fertigstellungsplan",
          "plural": "Fertigstellungspläne"
        }
      ]
    },
    "en": {
      "type": Array,
      "default": [
        {
          "label": "predraft",
          "plural": "predrafts"
        },
        {
          "label": "draft",
          "plural": "drafts"
        }
      ]
    }
  }
});

projectSchema.statics.addParticipant = function (projectid, participant) {
  logger.debug("Models/Project/addPartipicant: User to be added", projectid, participant);
  //add this user to project
  //first check if user with id already is added to this project
  var Projects = this;

  return Projects.findOneQ({  // get the Project instance
    _id: projectid,
    // checkt if the participant is already invited
    participants: {
      $elemMatch: { "user": participant.user }
    }
  })
    .then(function (project) {
      var participantWithOriginalObjectId;
      var participantInProject;

      if (project === null) {
        logger.debug("The Participant is not added to the project yet");
        //if no project with this participant is found, this user is not invited to this project yet, so go on
        return Projects.findOneAndUpdateQ({
          _id: projectid
        }, {
          $addToSet: {
            participants: participant
          }
        });
      } else {
        logger.debug("The Participant is already listed, but is a silent user");

        // find participiant in projects.participants Array
        participantInProject = _.find(project.participants, function (i) {
          return _.isEqual(i.user, participant.user);
        });

        //logger.debug("participantInProject.permission", participantInProject.permission);

        if (participantInProject && participantInProject.permission === "silent") {
          // the user is already part of the project, check if its a silent user
          // silent users will be upgraded to normal user
          // if the user is not silent, reject

          participantWithOriginalObjectId = participant;
          participantWithOriginalObjectId._id = participantInProject._id;

          return Projects.findOneAndUpdateQ({
            _id: projectid,
            'participants._id': participantInProject._id
          }, {
            $set: {
              'participants.$': participantWithOriginalObjectId
            }
          });
        } else {
          // participant is not silent
          logger.debug("The Participant is already in the project");
          return Projects.findOneQ({ _id: projectid});
        }
      }
    });
};

projectSchema.statics.findProjectByParticipantId = function (participantId) {
  return this.findOneQ({  // get the Project instance
    // checkt if the participant is already invited
    participants: {
      $elemMatch: { "_id": participantId }
    }
  });
};

projectSchema.statics.findParticipantById = function (projectid, participantid) {
  var deferred = Q.defer();
  this.findOne({
    '_id': projectid,
    'participants._id': participantid
  }, {
    'participants.$': 1
  })
    .populate('participants.user ', 'email profile.firstName profile.lastName lastlogindate alreadyloggedin')
    .exec(function (err, doc) {
      if (!err) {
        deferred.resolve(doc.participants[0]);
      } else {
        deferred.reject(new restify.errors.ResourceNotFoundError("Could not find participant by id " + participantid + " in project " + projectid));
      }
    });
  return deferred.promise;
};

projectSchema.statics.updateLastRevisionUploadDate = function (projectid) {
  return this.findByIdAndUpdateQ(
    projectid,
    {
      $set: {
        "lastrevisionupload": new Date()
      }
    });
};

projectSchema.methods.findParticipantById = function (participantid) {
  var deferred = Q.defer();
  var participants = this.participants;
  var foundparticipant = _.find(participants, function (participant) {
    return participant._id.toString() === participantid;
  });
  deferred.resolve(foundparticipant);
  return deferred.promise;
};

projectSchema.methods.findParticipantByEmail = function (participantemail) {
  var deferred = Q.defer();
  var participants = this.participants;
  var foundparticipant = _.find(participants, function (participant) {
    return participant.email === participantemail;
  });
  if (foundparticipant !== undefined) {
    deferred.resolve(foundparticipant);
  } else {
    deferred.resolve(null);
  }
  return deferred.promise;
};

module.exports = mongoose.model('projects', projectSchema);