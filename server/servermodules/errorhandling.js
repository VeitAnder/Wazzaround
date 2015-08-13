var config = require('../config.js');
var logger = require('../lib/logger.js');

var express = require('express');

var errorHandling = function (app) {
  app.use(function (err, req, res) {
    logger.log("ERROR ROUTE", err);
    // if there is an accesstoken and a tokenid, user has tried to download a plan via link
    if (!!req.query.accesstoken && !!req.query.tokenresourceid && err && err.statusCode === 403) {
      res.redirect(config.clienthost + "#!/login/accessdenied/");
    } else {
      // if the error has a statuscode, send, otherwise respond with 500 "Internal Server Error".
      res.send(err.statusCode ? err.statusCode : 500, err);
    }
  });

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
};

module.exports = {
  "errorHandling": errorHandling
};