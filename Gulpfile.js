var gulp = require('gulp')
  , livereload = require('gulp-livereload')
  , server = require('./lib/server')('node', ['web.js']);

var paths = {
  views: ['views/**/*.*'],
  backend: ['*.js', 'lib/*.js'],
  scripts: ['client/*.js'],
  images: 'client/img/**/*'
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
             .pipe(gulp.dest('build/js'))
             .pipe(livereload());
});

gulp.task('views', function() {
  return gulp.src(paths.views)
             .pipe(livereload());
});

gulp.task('backend', function() {
  return gulp.src(paths.backend)
             .pipe(livereload());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  server.start(function() {
    gulp.watch(paths.scripts, function() {
      gulp.run('scripts');
    });

    gulp.watch(paths.views, function() {
      gulp.run('views');
    });

    gulp.watch(paths.backend, function() {
      server.restart(function() {
        gulp.run('backend');
      });
    });
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);