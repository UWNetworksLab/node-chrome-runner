var copy = require('gulp-copy');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge2');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var vinylPaths = require('vinyl-paths');

var tsProject = ts.createProject({
  declarationFiles: true,
  module: 'commonjs',
  noEmitOnError: true,
  noExternalResolve: false,
  noImplicitAny: true
});

// All files created and used for building are in here
buildPath = 'build/';
// Development build path
devRootPath = path.join(buildPath, 'dev/');
devPath = path.join(devRootPath, 'node-chrome-runner/');
// Typescript src code in the development path
tsPath = path.join(devPath, '**/*.ts');
// Distribution build path
distRootPath = path.join(buildPath, 'dist');
distPath = path.join(distRootPath, 'node-chrome-runner/');

var tasks = {
  clean: 'clean',
  dist: 'dist',
  copy_src: 'copy-src',
  tsc: 'tsc'
};

gulp.task(tasks.copy_src, function() {
  return gulp.src(['src/**/*'])
      .pipe(copy(devPath, { prefix: 1 }));
});

gulp.task(tasks.tsc, [tasks.copy_src], function() {
  var tsResult = gulp.src([tsPath])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));
  return merge([
      tsResult.dts
        .pipe(gulp.dest(devPath)),
      tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(devPath))]);
});

gulp.task(tasks.clean, function(cb) {
  del([devRootPath, distRootPath], cb);
});

gulp.task(tasks.dist, [tasks.tsc], function() {
  return gulp.src([path.join(devPath, '**/*')])
    .pipe(copy(distPath, { prefix: devPath.split(path.sep).length }));
});

gulp.task('default', [tasks.tsc]);
