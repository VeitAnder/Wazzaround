var mongoose = require('mongoose-q')();
var _ = require('lodash');

//activity SCHEMA
var activitySchema = new mongoose.Schema({
  "user": {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  "date": {type: Date, required: true, "default": Date.now },
  "projectid": {type: String, required: true},
  "action": {type: String, required: true},
  "doc": {type: mongoose.Schema.Types.Mixed, required: true}
});

activitySchema.path('action').validate(function (value) {
  // all loggable activites
  var activityKeys = {
    // plans:
    postplan: {
      description: "Plan_NEU",
      implementedinclient: true
    },
    postplanrevision: {
      description: "Planrevision_NEU",
      implementedinclient: true
    },
    putplanname: {
      description: "Planname_geändert",
      implementedinclient: true
    },
    putplanphase: {
      description: "Planphase_geändert",
      implementedinclient: true
    },
    getplanrevisionpdf: {
      description: "PDF_heruntergeladen",
      implementedinclient: true
    },
    getplanrevisiondwg: {
      description: "DWG_heruntergeladen",
      implementedinclient: true
    },
    sendrevision: {
      description: "Revision_versendet", // @ TODO how to name sending of a revision and which rest event is that
      implementedinclient: "?"
    },
    // projects
    postproject: {
      description: "Projekt_NEU",
      implementedinclient: true
    },
    putprojecttitle: {
      description: "Projekttitel_NEU",
      implementedinclient: true
    },
    postprojectinvitation: {
      description: "Projekteinladung", //@ TODO refactor
      implementedinclient: true
    },
    putprojectparticipantenabled: {
      description: "Beteiligter_aktiviert_deaktiviert", //@ TODO refactor
      implementedinclient: true
    },
    putparticipantcompany: {
      description: "Beteiligter_Firma_geändert",
      implementedinclient: true
    },
    putparticipantname: {
      description: "Beteiligter_Name_geändert",
      implementedinclient: true
    },
    putparticipantrole: {
      description: "Beteiligter_Rolle_geändert",
      implementedinclient: true
    },
    postrole: {
      description: "Neue Rolle zum Projekt hinzugefügt",
      implementedinclient: true
    },
    sendmail: {
      description: "User hat ein Email an andere User versendet und wir speichern diese Info damit wir im Falle eines Bounce wissen, wer der/die Empfänger/in war",
      implementedinclient: true
    }
  };

  return _.has(activityKeys, value);
}, 'Invalid action key in activity model');

module.exports = mongoose.model('activities', activitySchema);