var config = require('../config.js');
var express = require('express');
var compress = require('compression');
var favicon = require('serve-favicon');
var fs = require('fs');
var _ = require('lodash');

var setupStaticAssetsServer = function (app, maxAge, extconfig) {
  var maxAgeStaticAssets,
    handle404;

  if (extconfig) {
    config = _.assign(config, extconfig);
  }

  // First looks for a static file: index.html, css, images, etc.
  app.use("/bower_components", compress());
  app.use("/fonts", compress());
  app.use("/img", compress());
  app.use("/styles", compress());
  app.use("/scripts", compress());
  app.use("/views", compress());

  // cache lifetime for static assets
  // checkout static content serving on  http://blog.modulus.io/nodejs-and-express-static-content
  maxAgeStaticAssets = (86400000 * 3);
  if (maxAge !== undefined) {
    maxAgeStaticAssets = maxAge;
  }

  app.use("/bower_components", express.static(config.server.distFolder + "/bower_components", {
    maxAge: maxAgeStaticAssets,
    etag: false
  }));
  app.use("/fonts", express.static(config.server.distFolder + "/fonts", {maxAge: maxAgeStaticAssets, etag: false}));
  app.use("/img", express.static(config.server.distFolder + "/img", {maxAge: maxAgeStaticAssets, etag: false}));
  app.use("/styles", express.static(config.server.distFolder + "/styles", {maxAge: maxAgeStaticAssets, etag: false}));
  app.use("/scripts", express.static(config.server.distFolder + "/scripts", {maxAge: maxAgeStaticAssets, etag: false}));
  app.use("/views", express.static(config.server.distFolder + "/views", {maxAge: maxAgeStaticAssets, etag: false}));
  app.use("/components", express.static(config.server.distFolder + "/components", {maxAge: maxAgeStaticAssets, etag: false }));
  app.use("/favicon", express.static(config.server.distFolder + "/favicon", {maxAge: maxAgeStaticAssets, etag: false}));

  // error handling for not available static assets eg. /img/notavailable.png
  handle404 = function (req, res) {
    res.status(404).end(); // If we get here then the request for a static file is invalid
  };

  app.use("/bower_components", function (req, res) {
    handle404(req, res);
  });

  app.use("/fonts", function (req, res) {
    handle404(req, res);
  });

  app.use("/img", function (req, res) {
    handle404(req, res);
  });

  app.use("/styles", function (req, res) {
    handle404(req, res);
  });

  app.use("/scripts", function (req, res) {
    handle404(req, res);
  });

  app.use("/views", function (req, res) {
    handle404(req, res);
  });

  app.use("/components", function (req, res) {
    handle404(req, res);
  });

  app.use("/favicon", function (req, res) {
    handle404(req, res);
  });

};

var setupMaintenanceMode = function (app, extconfig) {
  if (extconfig) {
    config = _.assign(config, extconfig);
  }

// Maintenance mode
// set maintainancemode on modulus.io to true to show maintainance.html to users
// shuts down the API too.
  if (process.env.maintainancemode === "true") {
    app.all('/*', function (req, res) {
      // Just send the maintenance.html
      res.sendfile('maintainance.html', {root: config.server.distFolder});
    });
  }
};

var serveClient = function (app) {
  // Serve up the favicon
  var favicon_icofile = config.server.distFolder + '/favicon.ico';
  fs.exists(favicon_icofile, function (exists) {
    if (exists) {
      app.use(favicon(favicon_icofile));
    }
  });

// Handle Access to http://url/*
// enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', {root: config.server.distFolder, maxAge: 0});
  });

};

module.exports = {
  "setupStaticAssetsServer": setupStaticAssetsServer,
  "setupMaintenanceMode": setupMaintenanceMode,
  "serveClient": serveClient
};