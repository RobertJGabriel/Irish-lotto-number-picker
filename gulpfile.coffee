gulp = require('gulp')
less = require('gulp-less')
gutil = require('gulp-util')
minifyCSS = require('gulp-minify-css')
uglify = require('gulp-uglify')
chalk = require('chalk')
logger = require('gulp-logger')
rename = require('gulp-rename')
concat = require('gulp-concat')
sass = require('gulp-sass')


gulp.task 'css', ->
    gulp.src('./assets/css/bootstrap/*.css')
    .pipe(minifyCSS(keepSpecialComments: 1))
    .pipe(logger(
        before: 'Compressing Css '
        after: 'Compressing finished!'
        extname: '.min.css'
        showChange: true))
    .pipe(minifyCSS())
    .pipe(rename(suffix: '.min'))
    .pipe gulp.dest('./assets/dist/css/bootstrap')
    return


gulp.task 'sass', ->
  gulp.src('./assets/css/sass/*.sass')
  .pipe(sass().on('error', sass.logError))
  .pipe(minifyCSS())
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/css')
  return




gulp.task 'js', ->
    gulp.src([
        './assets/js/vendor/jquery.js'
        './assets/js/vendor/bootstrap.js'
        './assets/js/vendor/material.js'
        './assets/js/vendor/ripples.js'
        './assets/js/vendor/vue.js'
        './assets/js/vendor/vue-resouces.js'
    ]).on('error', (err) ->
        gutil.log gutil.colors.red(err.message)
        return
    ).pipe(logger(
        before: 'Compling Javascript'
        after: 'Finished!'
        showChange: true))
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'))
    return

gulp.task 'build', [
    'css'
    'sass'
    'js'
]

gulp.task 'default', [ 'build' ]
