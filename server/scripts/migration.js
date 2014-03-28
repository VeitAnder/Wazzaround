#!/usr/bin/env node

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var modelizer = require('modelizer');

var models = require('../models/models');

var mongoTrg = {
  username: 'reactureappdev',
    password: 'pGjRLG72qvXBGo',
    dbName: 'reactureappdev',                                // The name of database that contains the security information
    host: 'ds027419.mongolab.com',                         // mongolab mongodb connection url
    port: '27419'
};

var mongoSrc = {
  username: 'reactureapp',
    password: 'pDDbi6FYWsVUftsH9',
    dbName: 'reactureapp',                                // The name of database that contains the security information
    host: 'ds029780-a0.mongolab.com:29780,ds029780-a1.mongolab.com:29780'                         // mongolab mongodb connection url
};

var dbTrg = mongojs('mongodb://'+ mongoTrg.username + ':' + mongoTrg.password + '@'+ mongoTrg.host + ':' + mongoTrg.port  + '/' + mongoTrg.dbName);
var dbSrc = mongojs('mongodb://'+ mongoSrc.username + ':' + mongoSrc.password + '@'+ mongoSrc.host + ':' + mongoSrc.port  + '/' + mongoSrc.dbName);

var connector = modelizer.MongoConnector(dbTrg);
models.ActivityModel.connection(connector);


var copyCollection = function(src, trg, col) {

  var srcCol = src.collection(col);
  var trgCol = trg.collection(col);

  trgCol.drop();

  srcCol.find({}).forEach(function (err, doc) {
    if (!err && doc) {
      trgCol.insert(doc);
    }
  })
}


/////////// Migration


//copyCollection(dbSrc, dbTrg, "users");


var activities = dbSrc.collection("activities");
var bookableItems = dbSrc.collection("bookableItems");
var events = dbSrc.collection("events");


dbTrg.collection("activities").drop();  // empty target collection

activities.find({}).forEach(function (err, doc) {

});



activities.find({}).forEach(function (err, doc) {
  if (!err && doc) {
    var activity = models.ActivityModel.create();

    for (var i in doc) {   // copy all fields
      activity[i] = doc[i];
    }

    for (var i=0; i<doc.bookableItems.length; i++) {
      bookableItems.findOne( {_id : ObjectId(doc.bookableItems[i]._reference)},
        function(err, doc) {
          console.log("i", i);
          console.log("activity.bookableItems[i]", activity.bookableItems);

          activity.bookableItems[i] = [];
          for (var j in doc) {   // copy all fields
            activity.bookableItems[i][j] = doc[j];
          }

          //activity.bookableItems[i].events = [];
          // ..events.find({})

          console.log("activity", activity);
          activity.save().done();
      });
    }

  }
});



/////////////////////
// console

var context = {}  // the available context in the debugger prompt

context.models = models;
context.dbTrg = dbTrg;
context.dbSrc = dbSrc;
context.copyCollection = copyCollection;


////////////////////////

var repl = require('repl').start('> ');
for (var i in context) {  // copy context to the repl
  repl.context[i] = context[i];
}
require('repl.history')(repl, process.env.HOME + '/.node_history');

