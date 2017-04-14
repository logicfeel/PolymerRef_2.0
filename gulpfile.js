var gulp = require('gulp');

var gutil    = require('gulp-util')
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('hello', function() { 
    console.log('hello (호출)');
});
 
gulp.task('world', ['hello'], function() {
    console.log('world (호출)');
});

function adapter(a, b,c) {
    console.log('default world (싱글)');
}

gulp.task('default', function() {
    var a = gulp.src('test.js')
        // .pipe(adapter());
        // .pipe(uglify());
        // .pipe(concat('all.js'))
        .pipe(gulp.dest('./js'));
    console.log('default world (싱글)');
});

/*
gulp.task('default', ['hello'], function(a) {
    
    console.log('default world (' + a[0] +')');
});
*/