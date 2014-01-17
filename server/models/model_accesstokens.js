var mongoose = require('mongoose-q')();
var token = require('token.js');

var accesstokenSchema = new mongoose.Schema({
  "token": {type: String, required: true, "default": function () {
    return token(32);
  }},
  "resourceid": {type: String, required: true},
  "expires": { type: Date },
  "user": { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
});

module.exports = mongoose.model('accesstokens', accesstokenSchema);