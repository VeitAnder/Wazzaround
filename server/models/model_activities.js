var mongoose = require('mongoose-q')();

//activity SCHEMA
var activitySchema = new mongoose.Schema({
  "name": {type: String, required: true},
  "address": {type: String},
  "email": {type: String},
  "phone": {type: String},
  "latitude": {type: String, required: true},
  "longitude": {type: String, required: true},
  "category" : {type: String, required: true}
});


module.exports = mongoose.model('activities', activitySchema);