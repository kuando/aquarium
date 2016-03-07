/**
 * Created by Frank on 16/3/7.
 */
'use strict';
var gulp = require('gulp');
var rev = require('gulp-rev');
var cssmin = require('gulp-cssmin');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');


gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('css', function () {
    return gulp.src('public/css/**/*.css')
        .pipe(cssmin())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'));
});


gulp.task('js', function () {
    return gulp.src('public/js/**/*.js')
        .pipe(uglify())
        .on('error', function (fileName, lineNumber, message) {
            console.error(fileName, lineNumber, message)
        })
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('default', ['clean', 'js', 'css']);