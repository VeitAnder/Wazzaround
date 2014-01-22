var mongoose = require('mongoose');
var config = require('../config.js');
var logger = require('../lib/logger.js');

////////////////////////////////////////////////////////
// Setup Mongoose DB Connection
var connectToDatabase = function () {
  var mongooseconfig = {
    db: {
      native_parser: false // native parser causes compile time troubles and is not faster than the JS implementation
    },
    server: {
      poolSize: 5,
      socketOptions: {
        keepAlive: 1
      },
      auto_reconnect: true
    },
    user: config.mongo.username,
    pass: config.mongo.password
  };

  mongoose.connect("mongodb://" + config.mongo.host + "/" + config.mongo.dbName, mongooseconfig);
  var db = mongoose.connection;

  db.on('error', function (err) {
    logger.error('mongoose connection error', err);
  });
  db.on('open', function callback() {
    logger.info("mongoose connection is open!");
  });
  db.on('reconnected', function () {
    logger.warn('MongoDB reconnected!');
  });
};

module.exports = {
  "connectToDatabase": connectToDatabase
};