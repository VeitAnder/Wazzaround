"use strict";

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  express = require('express'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  html2js = require('gulp-html2js'),
  browserSync = require('browser-sync'),
  favicons = require('favicons'),
  plumber = require('gulp-plumber'),
  gutil = require('gulp-util');

// Constants
var SERVER_PORT = 8000;
var clientpathdev = "./app/";
var clientpathdist = "./dist/";

// set env to local if not defined
if (!process.env.NODE_ENV || process.env.NODE_ENV === "developmentlocalhost") {
  console.log("process.env.NODE_ENV not properly set. Auto-Change to 'local' ");
  process.env.NODE_ENV = "local";
}

gulp.task('sass', function () {
  return gulp.src(clientpathdev + 'styles/*.scss')
    .pipe(plumber(function (error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest(clientpathdev + 'styles'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('lint', function () {
  return gulp.src([
      clientpathdev + 'scripts/**/*.js',
      clientpathdev + 'components/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('html2js', function () {
  gulp.src([
      clientpathdev + 'components/**/*.html',
      clientpathdev + 'views/**/*.html'
    ])
    .pipe(plumber(function (error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(html2js('angular.js', {
      name: 'templates.app',
      useStrict: true,
      adapter: 'angular',
      base: clientpathdev
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(clientpathdev + 'scripts'));
});

/*gulp.task('html2js', function () {
 gulp.src([
 clientpathdev + 'components/!**!/!*.html',
 clientpathdev + 'views/!**!/!*.html'
 ])
 .pipe(html2js({
 outputModuleName: 'templates.app',
 useStrict: true,
 base: clientpathdev
 }))
 .pipe(concat('templates.js'))
 .pipe(gulp.dest(clientpathdev + 'scripts'));
 });*/

gulp.task('favicons', function () {
  function generateFavicons(cb) {
    favicons({
      // I/O
      files: {
        src: './app/favicon/original/favicon.png',
        dest: './dist/favicon/',
        html: './dist/index.html'
      },
      icons: {
        // Icon Types
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: true,
        windows: true,
        yandex: true
      },
      settings: {
        // Miscellaneous
        background: '#ffffff',
        url: "https://www.wazzaround.com",
        logging: true,
        developerURL: "www.wazzaround.com",
        developer: "anorak.io",
        appName: "wazzaround",
        appDescription: "wazzaround"
      }
    }, cb);
  }

  generateFavicons(function () {
    // wrap typoscript
    gulp.src("./dist/index.html")
      .pipe(gulp.dest("./dist/"));

  });
});

gulp.task('reload:html', function () {
  return gulp.src(clientpathdev + 'index.html')
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['html2js'], function () {
  gulp.watch(clientpathdev + '/styles/**/*.scss', ['sass']);

  gulp.watch([
      clientpathdev + '/**/*.html',
      clientpathdev + '/scripts/**/*.js',
      clientpathdev + '/components/**/*.js',
      '!' + clientpathdev + '/scripts/templates.js'
    ],
    ['html2js', 'reload:html']
  );
});

gulp.task('server', [], function () {
  require("../server/server.js");
});

gulp.task('client', ['sass', 'html2js', 'watch', 'browser-sync'], function () {
  var app = express();

  var config = {
    server: {
      distFolder: clientpathdev
    }
  };
  require("../server/servermodules/serveclient.js").setupStaticAssetsServer(app, 0, config);
  require("../server/servermodules/serveclient.js").serveClient(app, config);
  app.listen(SERVER_PORT);
});

// Proxy to existing vhost (version 0.7.0 & greater)
// https://github.com/shakyShane/gulp-browser-sync
gulp.task('browser-sync', function () {
  browserSync({
    proxy: "localhost:8000",
    port: 9000,
    notify: false,
    injectChanges: true,   // Don't try to inject, just do a page refresh
    ghostMode: {  // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
      clicks: false,
      forms: false,
      scroll: false
    },
    open: false
  });
});

gulp.task('clientdist', ['server'], function () {
  var app = express();

  var config = {
    server: {
      distFolder: clientpathdist
    }
  };

  require("../server/servermodules/serveclient.js").setupStaticAssetsServer(app, 0, config);
  require("../server/servermodules/serveclient.js").serveClient(app, config);
  app.listen(SERVER_PORT);
});

// alias task for old serve
gulp.task('serve', ['client']);

// just gulp, and entire app starts!
gulp.task('default', ['sass', 'server', 'client']);
