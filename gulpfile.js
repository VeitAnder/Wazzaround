"use strict";

var gulp = require('gulp');
var inlineCss = require('gulp-inline-css');

gulp.task('inlinecss', function () {
  return gulp.src('./server/templates/source/**/*.handlebars.html')
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: true,
      removeLinkTags: true
    }))
    .pipe(gulp.dest('_temp/server/templates/source/'));
});