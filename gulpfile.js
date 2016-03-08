/**
 * Created by Frank on 16/3/7.
 */
'use strict';
const gulp = require('gulp');
const rev = require('gulp-rev');
const csso = require('gulp-csso');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const filter = require('gulp-filter');
const revReplace = require("gulp-rev-replace");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const gulpSequence = require('gulp-sequence');

const igFilter = filter(file=> {
    return !/js\/lib/.test(file.path) && !/css\/theme/.test(file.path);
}, {restore: true});


const jsFilter = filter('**/*.js', {restore: true});
const cssFilter = filter('**/*.css', {restore: true});

//清理dist文件夹
gulp.task('clean', function () {
    return gulp.src('dist', {read: false}).pipe(clean());
});


//图片压缩
gulp.task('image', function () {
    return gulp.src("public/images/**/*")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('revision', function () {
    return gulp.src(["public/**/*.css", "public/**/*.js"])
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(igFilter)
        .pipe(rev())
        .pipe(igFilter.restore)
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
});


gulp.task("revreplace", ["revision"], function () {
    var manifest = gulp.src("dist/rev-manifest.json");
    return gulp.src("views/**/*.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest('dist/views'));
});

gulp.task('build', gulpSequence('clean', ['revreplace', 'image']));