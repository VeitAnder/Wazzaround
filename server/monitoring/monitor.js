/**
 * Created with JetBrains WebStorm.
 * User: jonathan
 * Date: 16.09.13
 * Time: 14:02
 * To change this template use File | Settings | File Templates.
 */

/*
 var config = require('./config.js');

 // for NodeTime Monitoring
 var nodetime = require('nodetime');
 nodetime.profile({
 accountKey: 'b01f439ac38eb6d06f7c0a52095e89b52c1e62d1',
 appName: 'reacture Development Application'
 });

 // db connection via mongoose
 var mongoose = require('mongoose');


 // connect to mongolab db via mongoose
 // http://mongoosejs.com/docs/connections.html
 var mongooseconfig = {
 db: {
 native_parser: true
 },
 server: {
 poolSize: 5,
 socketOptions: {
 keepAlive: 1
 }
 },
 user: config.mongo.username,
 pass: config.mongo.password
 };

 mongoose.connect(config.mongo.mongooseurl + config.mongo.dbName, mongooseconfig);
 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'mongoose connection error:'));
 db.once('open', function callback() {
 console.log("mongoose connection open - yeaaaah!");
 });

 var Users = require('./models/model_users.js');
 */

var nodetime = require('nodetime');
var Q = require('q');
var _ = require('lodash');

var Users = require('../models/model_users.js');
var Projects = require('../models/model_projects.js');
var Plans = require('../models/model_plans.js');

var monitorCnt = 0;

// TODO: das Monitoring sollte später in einer eigenen App laufen,
// da sonst das ganze unötierweise mehrmals pro Drone ausgeführt wird!

module.exports = {
  monitor: function () {

    // Get parallel all Mesurements from Database
    var measurements = [
      Users.countQ("{enabled:true}")
        .then(function (count) {
          nodetime.metric("KPIs", "Number of active users", count, 'users', 'set');
          return { numOfActiveUsers: count };
        }),
      Projects.countQ()
        .then(function (count) {
          nodetime.metric("KPIs", "Number of projects", count, 'projects', 'set');
          return { numOfPojects: count };
        }),
      Plans.countQ()
        .then(function (count) {
          nodetime.metric("KPIs", "Number of plans managed", count, 'plans', 'set');
          return { numOfPlansManaged: count };
        }),
      Projects.countQ("{},{participants:1}")
        .then(function (count) {
          nodetime.metric("KPIs", "Number of all Participants", count, 'users', 'set');
          return { numOfParticipants: count };
        }),
      /*    Plans.aggregateQ(
       {$unwind: "$revisions"},
       {$group : {
       _id : "$projectid",
       project_pdf_size : {
       $sum: "$revisions.pdf_metadata.size" }
       },
       project_dwg_size : {
       $sum: "$revisions.dwg_metadata.size" }
       })                 */
      Plans.aggregateQ(
        {
          $unwind: "$revisions"
        },
        {
          $group: {
            _id: "$projectid",
            project_pdf_size: {
              $sum: "$revisions.pdf_metadata.size"
            },
            project_dwg_size: {
              $sum: "$revisions.dwg_metadata.size"
            }
          }
        })
        .then(function (res) {
          var numOfProjects = res.length;
          var totalPDFSizes = _.reduce(res, function (memo, value) {
            return memo + value.project_pdf_size;
          }, 0);
          var totalDWGSizes = _.reduce(res, function (memo, value) {
            return memo + value.project_dwg_size;
          }, 0);

          nodetime.metric("KPIs - Plans", "Average Size of PDF Files", (totalPDFSizes / numOfProjects), "byte", "set");
          nodetime.metric("KPIs - Plans", "Average Size of DWG Files", (totalDWGSizes / numOfProjects), "byte", "set");

          return { planSizes: res };
        })
    ];

    // When all measurements are received
    Q.all(measurements)
      .then(function (results) {

        // build result object
        var metrics = {};
        results.forEach(function (result) {
          _.extend(metrics, result);
        });

        //logger.debug("Metrics", metrics);

        // Calculate Metrics

        nodetime.metric("KPIs", "Average Plans per project", (metrics.numOfPlansManaged / metrics.numOfPojects), "plans", "set");
        nodetime.metric("KPIs", "Average Participant per project", (metrics.numOfParticipants / metrics.numOfPojects), "users", "set");

        monitorCnt += 1;
        //logger.debug("Monitored Count", monitorCnt);

        return metrics;
      })
      .fail(function (error) {
        //console.error("Monitoring failed! Reason: " + error);
      })
      .done();
  }
};

// Setup monitoring
//setInterval(Monitor, 1000);
//Monitor();

// for developing
//module.exports = mongoose;

// console call
// var foo = require('./monitoring/monitor.js');
// Projects.findQ().then(function(projects) {console.log(projects)});


