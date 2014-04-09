#!/usr/bin/env node


/////////////////////
// console

var repl = function(context) {

  ////////////////////////

  var repl = require('repl').start('> ');
  for (var i in context) {  // copy context to the repl
    repl.context[i] = context[i];
  }
  require('repl.history')(repl, process.env.HOME + '/.node_history');

};

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

var modelizer = require('modelizer');

var models = require('../models/models');

//var mongoTrg = {
//  username: 'reactureappdev',
//    password: 'pGjRLG72qvXBGo',
//    dbName: 'reactureappdev',                                // The name of database that contains the security information
//    host: 'ds027419.mongolab.com',                         // mongolab mongodb connection url
//    port: '27419'
//};

var mongoTrg = {
  username: 'reactureapp',
    password: 'pDDbi6FYWsVUftsH9',
    dbName: 'reacture_migrate',                                // The name of database that contains the security information
    host: 'ds035557.mongolab.com',                         // mongolab mongodb connection url
    port: '35557'
};

var mongoSrc = {
  username: 'reactureapp',
    password: 'pDDbi6FYWsVUftsH9',
    dbName: 'reactureapp',                                // The name of database that contains the security information
//    host: 'ds029780-a0.mongolab.com:29780,ds029780-a1.mongolab.com:29780'                         // mongolab mongodb connection url
    host: 'ds029780-a0.mongolab.com',                         // mongolab mongodb connection url
    port : '29780'
};

var dbTrg = mongojs('mongodb://'+ mongoTrg.username + ':' + mongoTrg.password + '@'+ mongoTrg.host + ':' + mongoTrg.port  + '/' + mongoTrg.dbName);
var dbSrc = mongojs('mongodb://'+ mongoSrc.username + ':' + mongoSrc.password + '@'+ mongoSrc.host + ':' + mongoSrc.port  + '/' + mongoSrc.dbName);


//var connector = modelizer.MongoConnector(dbTrg);
//models.ActivityModel.connection(connector);


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

var Server = require("mongo-sync").Server;
var serverSrc = new Server(mongoSrc.host + ':' + mongoSrc.port);

/*
var Fiber = require('fibers');
Fiber(function() {

  // set up goes here ...
  var dbSrc = serverSrc.db(mongoSrc.dbName);
  dbSrc.auth(mongoSrc.username, mongoSrc.password);


  var activitiesCol = dbSrc.getCollection("activities");
  var bookableItemsCol = dbSrc.getCollection("bookableItems");
  var eventsCol = dbSrc.getCollection("events");

  activitiesCol.find().forEach(function(activityDoc) {
    var activity = models.ActivityModel.create();

    for (var i in activityDoc) {   // copy all fields
      if (i !== "bookableItems") {
        activity[i] = activityDoc[i];
      }
    }

    for (var i=0; i<activityDoc.bookableItems.length; i++) {
      var item = activity.createBookableItems();

      var bookableItemDoc = bookableItemsCol.findOne( {_id : ObjectId(activityDoc.bookableItems[i]._reference)});
      //console.log("bookableItem", bookableItemDoc);

      for (var j in bookableItemDoc) {   // copy all fields
        if (j !== "events" && j !== "owner") {
          item[j] = bookableItemDoc[j];
        }
      }

      for (var j=0; j<bookableItemDoc.events.length; j++) {
        var event = item.createEvents();

        var eventDoc = eventsCol.findOne( {_id : ObjectId(bookableItemDoc.events[j]._reference)});
        //console.log("eventDoc", eventDoc);

        for (var k in eventDoc) {   // copy all fields
          if (k !== "owner") {
            event[k] = eventDoc[k];
          }
        }

        //console.log("event", event);
      }
    }

    activity.save().done();
    console.log("Activity migrated: ", activity);
  });

  // done
  process.exit(1);

}).run();
*/


copyCollection(dbSrc, dbTrg, "users");


/*
var activities = dbSrc.collection("activities");
var bookableItems = dbSrc.collection("bookableItems");
var events = dbSrc.collection("events");


dbTrg.collection("activities").drop();  // empty target collection





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

*/

