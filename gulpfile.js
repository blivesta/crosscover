var del = require('del');
var gulp = require('gulp');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var pkg = require('./package.json');
var plumber = require('gulp-plumber');
var cssnext = require('gulp-cssnext');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

var banner = [
'/*!',
' * <%= pkg.name %> v<%= pkg.version %>',
' * <%= pkg.description %>',
' * <%= pkg.homepage %>',
' * License : <%= pkg.license %>',
' * Author : <%= pkg.author %>',
' */',
''].join('\n');

var browsers = ['last 2 versions'];

var dirs = {
  src:'./src',
  dist:'./dist'
};

gulp.task('css', function () {
  return gulp.src(dirs.src + '/css/' + pkg.name + '.css')
    .pipe(header(banner, {pkg:pkg}))
    .pipe(cssnext({
      browsers: browsers,
    }))
    .pipe(gulp.dest(dirs.dist + '/css'))
    .pipe(cssnext({
      browsers: browsers,
      compress: true
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('js', function(){
  return gulp.src(dirs.src + '/js/' + pkg.name + '.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(header(banner, { pkg:pkg }))
    .pipe(gulp.dest(dirs.dist + '/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(banner, { pkg:pkg }))
    .pipe(gulp.dest(dirs.dist + '/js'));
});

gulp.task('cleanup', function(){
  return del([ './dist' ]);
});

gulp.task('default',['build'], function(){
  gulp.watch(['./src/css/**/*.css'], ['css']);
  gulp.watch(['./src/js/*.js'], ['js']);
});

gulp.task('build', function(cd){
  runSequence(
    'cleanup',
    ['js'],
    'css',
    cd
  );
});
