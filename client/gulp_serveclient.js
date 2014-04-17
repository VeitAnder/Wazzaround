"use strict";

var config = {
  server: {
    distFolder: "./app"
  }
};

var express = require('express');

var setupStaticAssetsServer = function (app) {
  var handle404;
  // cache lifetime for static assets
  // checkout static content serving on  http://blog.modulus.io/nodejs-and-express-static-content
  var maxAgeStaticAssets = 0;

  // First looks for a static file: index.html, css, images, etc.
  app.use("/bower_components", express.compress());
  app.use("/fonts", express.compress());
  app.use("/img", express.compress());
  //  static/img is a legacy route for images in already sent and future emails
  app.use("/static/img", express.compress());
  app.use("/styles", express.compress());
  app.use("/scripts", express.compress());
  app.use("/views", express.compress());

  app.use("/bower_components", express.static(config.server.distFolder + "/bower_components", {maxAge: maxAgeStaticAssets }));
  app.use("/fonts", express.static(config.server.distFolder + "/fonts", {maxAge: maxAgeStaticAssets }));
  app.use("/img", express.static(config.server.distFolder + "/img", {maxAge: maxAgeStaticAssets }));
  app.use("/static/img", express.static(config.server.distFolder + "/img", {maxAge: maxAgeStaticAssets }));
  app.use("/styles", express.static(config.server.distFolder + "/styles", {maxAge: maxAgeStaticAssets }));
  app.use("/scripts", express.static(config.server.distFolder + "/scripts", {maxAge: maxAgeStaticAssets }));
  app.use("/views", express.static(config.server.distFolder + "/views", {maxAge: maxAgeStaticAssets }));
  app.use("/favicon", express.static(config.server.distFolder + "/favicon", {maxAge: maxAgeStaticAssets }));

  // error handling for not available static assets eg. /img/notavailable.png
  handle404 = function (req, res) {
    res.send(404); // If we get here then the request for a static file is invalid
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

  app.use("/static/img", function (req, res) {
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

  app.use("/favicon", function (req, res) {
    handle404(req, res);
  });

};

var serveClient = function (app) {
  // Serve up the favicon
  app.use(express.favicon(config.server.distFolder + '/favicon.ico'));

// Handle Access to http://url/*
// enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendfile('index.html', { root: config.server.distFolder, maxAge: 0 });
  });

};

module.exports = {
  "setupStaticAssetsServer": setupStaticAssetsServer,
  "serveClient": serveClient
};