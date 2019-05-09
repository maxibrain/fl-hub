// grab our gulp packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch');

// create a default task and just log a message
gulp.task('default', function () {
    return gutil.log('Gulp is running!');
});

gulp.task('stream', function () {
    // Endless stream mode 
    return watch('css/**/*.css', { ignoreInitial: false })
        .pipe(gulp.dest('build'));
});

gulp.task('callback', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event 
    return watch('css/**/*.css', function () {
        gulp.src('css/**/*.css')
            .pipe(gulp.dest('build'));
    });
});
