var gulp = require('gulp');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var connect = require('gulp-connect');
var open = require('gulp-open');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// error function for plumber
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

var config = {
  app: {
      'templates': 'content/templates/',
      'data': 'content/data/',
      'styles': 'styles',
      'javascripts' : 'javascripts',
      'images' : 'images',
      'assets': 'assets',
      'govuk_frontend_toolkit': 'node_modules/govuk_frontend_toolkit',
      'govuk_elements_sass': 'node_modules/govuk-elements-sass/public/sass'
    },
  target: {
    'html': 'build/',
    'styles': 'build/public/stylesheets',
    'images': 'build/public/images',
    'scripts': 'build/public/javascripts',
    'assets': 'build/public',
    'build_folder': 'build/'
  },
  sass: {
    options: {
      noCache: true,
      compass: false,
      bundleExec: true,
      sourcemap: true,
      outputStyle: 'compressed',
      includePaths: ['node_modules/govuk-elements-sass/public/sass','node_modules/govuk_frontend_toolkit/stylesheets']
    }
  },
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  }
};

// tasks for copying the base files
gulp.task('copy:assets', function () {
  gulp.src(['assets/**/*']).pipe(gulp.dest(config.target.assets));
});
gulp.task('copy:javascripts', function () {
  gulp.src(['javascripts/**/*']).pipe(gulp.dest(config.target.scripts));
});
gulp.task('copy:images1', function () {
  gulp.src(['node_modules/govuk_frontend_toolkit/images/**/*']).pipe(gulp.dest(config.target.images));
});
gulp.task('copy:images2', function () {
  gulp.src(['images/**/*']).pipe(gulp.dest(config.target.images));
});
gulp.task('copyfiles', ['copy:assets', 'copy:javascripts', 'copy:images1', 'copy:images2']);


// javascript linting
gulp.task('lint', function() {
  return gulp.src(['javascripts/*.js','javascripts/govuk/*.js','!javascripts/details.polyfill.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(connect.reload());
});


gulp.task('sass', function() {
  return gulp.src('styles/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(autoprefixer(config.autoprefixer.browsers))
    .pipe(sass(config.sass.options)) // Using gulp-sass
    .pipe(gulp.dest(config.target.styles))
    .pipe(connect.reload());
});


// custom filter used in Nunjucks
var manageEnvironment = function(environment) {
  environment.addFilter("tojson", function(str,nodename) {
    var returnObj;
    if (nodename === undefined){
      returnObj = JSON.parse(str);
    } else {
      returnObj = JSON.parse(str)[nodename];

      // add in the name of the node so it can be accessed in the macro as the field name
      if(returnObj !== undefined){
        returnObj.field = nodename;
      }
    }
    return returnObj;
  });
}

gulp.task('nunjucks-render', function() { 
  return gulp.src('content/templates/*.njk')
  .pipe(nunjucksRender({
    manageEnv: manageEnvironment,
    path: ['.'] // String or Array
  }))
  .pipe(gulp.dest('build'))
  .pipe(connect.reload());
}); 

// clear out build folder
gulp.task('clean', function() { 
  return gulp.src('build', {read: false})
    .pipe(clean());
}); 


gulp.task('replace:dev', function(){
  gulp.src(['javascripts/appconfig.js'])
    .pipe(replace('@@config_mode', 'local_dev'))
    .pipe(gulp.dest('build/public/javascripts/'));
});
gulp.task('replace:build', function(){
  gulp.src(['javascripts/appconfig.js'])
    .pipe(replace('@@config_mode', 'staging'))
    .pipe(gulp.dest('build/public/javascripts/'));
});


gulp.task('connect', function() {
  connect.server({
    name: 'Dev App',
    root: ['build'],
    port: 8000,
    livereload: true
  });
});
gulp.task('uri', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:8000/example.html'}));
});

gulp.task('startwatch', function() {
  gulp.watch('content/data/**/*.json', ['nunjucks-render']);
  gulp.watch('content/templates/**/*.njk', ['nunjucks-render']);
  gulp.watch('styles/**/*.scss', ['sass']);
  gulp.watch('javascripts/**/*.js', ['lint','copy:javascripts']);
});



gulp.task('dev', function(callback) {
  runSequence('clean',
    ['lint','copyfiles', 'sass', 'nunjucks-render'],
    'replace:dev',
    ['connect', 'uri', 'startwatch'],
    callback);
});

gulp.task('default', function(callback) {
  runSequence('clean',
    ['copyfiles', 'sass', 'nunjucks-render'],
    'replace:build',
    callback);
});


