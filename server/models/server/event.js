/**
 * Created by jonathan on 20.03.14.
 */


/**
 * Created by jonathan on 19.03.14.
 */


/*
var moment = require('moment');
moment.lang('en');

var ObjectId = require('mongojs').ObjectId;

var EventModel = require('../models.js').EventModel;



///////////////////////
// read/write filters

EventModel.readFilter(function(req) {
  return true;  // allow global read
});

EventModel.writeFilter(function (doc, req) {
  console.log("save event", doc);

  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  var ownerRef = doc.owner._reference;
  if (doc.owner._reference instanceof ObjectId) { // workaround for delete
    ownerRef = ownerRef.toString();
  }
  // don't allow to save activities where the user is not the owner
  if (doc._id !== undefined && ownerRef !== req.user._id) {
    return false;
  }

  // set the owner of the activity
  doc.owner._reference = ObjectId(req.user._id);
  return true;
});

*/

///////////////////////
// Operation Impl.

