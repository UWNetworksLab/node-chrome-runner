var gulp = require('gulp');
var ts = require('gulp-typescript');
var copy = require('gulp-copy');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');

var tsProject = ts.createProject({
    declarationFiles: true,
    //noExternalResolve: true,
    //noEmitOnError: true,
    noImplicitAny: true,
    module: 'commonjs'
});

var devBuildPath = 'build/dev/node-chrome-runner/';

var tasks = {
  src: 'typescript-src',
  clean: 'clean'
}

gulp.task(tasks.src, function() {
  var tsResult = gulp.src('src/*.ts')
      .pipe(copy(devBuildPath, { prefix: 1 }))
      // .pipe(sourcemaps.init())
      .pipe(ts(tsProject));

    return merge([
        tsResult.dts
          .pipe(gulp.dest(devBuildPath)),
        tsResult.js
          // .pipe(sourcemaps.write(devBuildPath))
          .pipe(gulp.dest(devBuildPath))]);
});

gulp.task(tasks.clean, function() {
  return gulp.src('build/dev', {read: false}).pipe(clean());
});

gulp.task('default', [tasks.src]);
