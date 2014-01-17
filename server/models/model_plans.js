var Q = require('q');
var mongoose = require('mongoose-q')();
var _ = require('lodash');

var planSchema = new mongoose.Schema({
  "name": { type: String, required: true },
  "content": { type: String, required: true },
  "projectid": { type: String, required: true },
  "revisions": [
    {
      "revisionindex": { type: Number, required: true, "default": 0 },
      "index": { type: String, required: true },
      "pdf_file": {
        "key": { type: String },
        "filesize": { type: Number }, //in bytes
        "filename": { type: String }
      },
      "dwg_file": {
        "key": { type: String },
        "filesize": { type: Number },  // in bytes
        "filename": { type: String }
      },
      "comment": { type: String },
      "created": { type: Date, required: true, "default": Date.now },
      "createdby": { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      "creator_roles": { type: Array }
    }
  ],
  "created": { type: Date, required: true, "default": Date.now },
  "createdby": { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  "modified": { type: Date, required: true, "default": Date.now },
  "phasetag": { type: Number, required: true },
  "tags": [
    { type: String }
  ]
});

planSchema.methods.findPlanRevisionById = function (revisionid) {
  var deferred = Q.defer();
  var revisions = this.revisions;
  var foundrevision = _.find(revisions, function (revision) {
    return revision._id.toString() === revisionid;
  });
  deferred.resolve(foundrevision);
  return deferred.promise;
};

module.exports = mongoose.model('plans', planSchema);