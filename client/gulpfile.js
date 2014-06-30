"use strict";

var gulp = require('gulp'),
  refresh = require('gulp-livereload'),
  jshint = require('gulp-jshint'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  html2js = require('gulp-html2js'),
  shell = require('gulp-shell');

// Constants
var SERVER_PORT = 9000;
var LIVERELOAD_PORT = 35729;

gulp.task('sass', function () {
  return gulp.src('./app/styles/*.scss')
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('./app/styles'))
    .pipe(refresh(lrserver));
});

gulp.task('lint', function () {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('html2js', function () {
  gulp.src('./app/views/**/*.html')
    .pipe(html2js({
      outputModuleName: 'templates.app',
      useStrict: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./app/scripts'));
});

// Serve tasks
gulp.task('reload:html', function () {
  return gulp.src('./app/index.html')
    .pipe(refresh(lrserver));
});

gulp.task('watch', ['html2js'], function () {
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['html2js', 'reload:html']);
  gulp.watch(['app/**/*.js', '!app/scripts/templates.js'], ['reload:html']);
});

gulp.task('server', [], function () {
  require("../server/server.js");
});

gulp.task('client', ['watch'], function () {
  var app = express();
  var config = {
    server: {
      distFolder: "./app"
    }
  };

  app.use(livereload({
    port: LIVERELOAD_PORT
  }));

  require("../server/servermodules/serveclient.js").setupStaticAssetsServer(app, 0, config);
  require("../server/servermodules/serveclient.js").serveClient(app, config);

  app.listen(SERVER_PORT);
  lrserver.listen(LIVERELOAD_PORT);
});

gulp.task('clientdist', function () {
  var app = express();

  var config = {
    server: {
      distFolder: "./dist"
    }
  };

  require("../server/servermodules/serveclient.js").setupStaticAssetsServer(app, 0, config);
  require("../server/servermodules/serveclient.js").serveClient(app, config);
  app.listen(SERVER_PORT);
});

// alias task for old serve
gulp.task('serve', ['client']);

// just gulp, and entire app starts!
gulp.task('default', ['server', 'client']);