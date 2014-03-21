/**
 * Created by jonathan on 19.03.14.
 */

var Q = require('q');
var moment = require('moment');
moment.lang('en');

var ObjectId = require('mongojs').ObjectId;
var _ = require('lodash');

var models = require('../models.js');
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

