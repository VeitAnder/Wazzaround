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

gulp.task('startserver', shell.task([
    'sh ../server/startserver.sh &'
  ])
);

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
  return gulp.src('./app/**/*.html')
    .pipe(refresh(lrserver));
});

gulp.task('watch', function () {
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/**/*.html', ['html2js', 'reload:html']);
  gulp.watch('app/**/*.js', ['reload:html']);
});

gulp.task('serve', ['watch'], function () {
  var app = express();
  app.use(livereload({
    port: LIVERELOAD_PORT
  }));
  require("./gulp_serveclient.js").setupStaticAssetsServer(app);
  require("./gulp_serveclient.js").serveClient(app);
//  app.use(express.static('./app'));
  app.listen(SERVER_PORT);

  lrserver.listen(LIVERELOAD_PORT);
});

gulp.task('default', ['serve']);