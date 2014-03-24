/**
 * Created with JetBrains WebStorm.
 * User: jonathan
 * Date: 07.02.14
 * Time: 16:29
 * To change this template use File | Settings | File Templates.
 */

var model = require('modelizer');
//var model = require('../../../../modelizer/lib/modelizer.js');

var config = require('../config.js');

var initModelizer = function (app, db) {

  // get a mongodb database connector
  var connector = model.MongoConnector(db);

  // say that our model should use express and the database connector

  // setup connection and express for all models
  model.globalConnection = connector;
  model.globalExpress = app;

  // importing our models
  var models = require('../models/models.js');


//  models.UserModel.connection(connector);
//  models.UserModel.express(app);
//  models.UserModel.serve();
//
//  models.ActivityModel.connection(connector);
//  models.ActivityModel.express(app);
//  models.ActivityModel.serve();
//
//
//  models.CategoryModel.connection(connector);
//  models.CategoryModel.express(app);
//  models.CategoryModel.serve();

  // apply server model
//  require('../models/server/booking');
//  require('../models/server/bookableItem');
//  require('../models/server/user');
//  require('../models/server/activity');
//  require('../models/server/accesstoken');
//  require('../models/server/event');

  // load all files in directory
  require("fs").readdirSync("./models/server/").forEach(function(file) {
    require("../models/server/" + file);
  });

};


module.exports = {
  initModelizer : initModelizer
};