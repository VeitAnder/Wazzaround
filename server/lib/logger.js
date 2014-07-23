var winston = require('winston');
var morganlogger = require('morgan');

var beautify = require('js-beautify').js_beautify;

//var Loggly = require('winston-loggly').Loggly;

var config = require('../config.js');

// Import logentries cloud service
if (config.logging.using_logentries_service) {
  var logentries = require('node-logentries');
  var logentries_log = logentries.logger({
    token: config.logging.logentries_token
  });
}

// setup Console-Transport-Options
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console,
  {
    level: config.logging.level,  // the log level
    colorize: config.logging.colorize,
    handleExceptions: true  // Handling Uncaught Exceptions with winston
  }
);

// Do not exit on unhandled exceptions
//winston.exitOnError = false;
//winston.cli(); // Using winston in a CLI tool

// log all winston log messages to logentries service
if (config.logging.using_logentries_service) {
  // use as a winston transport for the logentries-Cloud-Service
  logentries_log.winston(winston, { level: config.logging.level });
}

// http://stackoverflow.com/questions/9141358/how-do-i-output-connect-expresss-logger-output-to-winston
winston.expressLogger = morganlogger("combined",  // Logging requests
  {
    stream: {
      write: function (message, encoding) {
        winston.verbose(message);  // log express message (log-level verbose)
      }
    }
  }
);

// loggin client stuff
winston.logRequest = function (req, res, next) {
  var logMSG = req.body;
  logMSG = JSON.stringify(logMSG);
  logMSG = beautify(logMSG);
  logMSG = logMSG.replace(/\\n/g,"\n");
  winston.silly(logMSG);
  res.send(200);
};

/*
 Diese Log-Levels stehen zur Verfügung:
 silly: 0,
 debug: 1,
 verbose: 2,
 info: 3,
 warn: 4,
 error: 5
 */

module.exports = winston;
