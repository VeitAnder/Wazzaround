/**
 * Created by jonathan on 20.03.14.
 */


/**
 * Created by jonathan on 19.03.14.
 */

var Q = require('q');
var moment = require('moment');
moment.lang('en');

var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models.js');
var EventModel = require('../models.js').EventModel;



///////////////////////
// read/write filters

EventModel.readFilter(function(req) {
  return true;  // allow global read
});

EventModel.writeFilter(function (doc, req) {
  if (!req.session.auth) {
    return false;  // if not logged in don't allow write operations
  }

  // don't allow to save activities where the user is not the owner
  if (doc._id !== undefined && doc.owner._reference !== req.session.user._id) {
    return false;
  }

  // set the owner of the activity
  doc.owner._reference = ObjectId(req.session.user._id);
  return true;
});



///////////////////////
// Operation Impl.

