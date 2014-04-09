/**
 * Created by jonathan on 19.03.14.
 */

var moment = require('moment');
moment.lang('en');

var ObjectId = require('mongojs').ObjectId;

var BookableItemModel = require('../models.js').BookableItemModel;



///////////////////////
// read/write filters

BookableItemModel.readFilter(function(req) {
  return true;  // allow global read
});

BookableItemModel.writeFilter(function (doc, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  var ownerRef = doc.owner._reference;
  if (doc.owner._reference instanceof ObjectId) { // workaround for delete
    ownerRef = ownerRef.toString();
  }
  // don't allow to save activities where the user is not the owner
  if (doc._id !== undefined && ownerRef !== req.session.user._id) {
    return false;
  }

  // set the owner of the activity
  doc.owner._reference = ObjectId(req.session.user._id);
  return true;
});



///////////////////////
// Operation Impl.

