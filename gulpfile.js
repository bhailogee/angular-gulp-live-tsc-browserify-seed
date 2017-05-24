// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var typescript = require('gulp-tsc');
var watch = require('gulp-watch');
var linker = require('gulp-linker');
var livereload =require('gulp-livereload');


// tasks
gulp.task('lint', function() {
 gulp.src(['./app/**/*.js', '!./app/bower_components/**','!./app/js/browserify/**','!./app/js/browserified/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('compile', function () {
    return gulp.src(['./app/**/*.ts', '!./app/bower_components/**','!./app/js/browserify/**'],{ base: '.' })
    .pipe(typescript({emitError:false}))
    .pipe(gulp.dest('.'));

});
gulp.task('clean', function() {
    return gulp.src('./dist/*')
      .pipe(clean({force: true}));
});
gulp.task('cleanbundle', function() {
    return gulp.src(['./app/js/bundled.js','./app/js/browserified/*.js'])
        .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  return gulp.src(['./app/**/*.css', '!./app/bower_components/**','!./app/js/browserify/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('minify-js', function() {
  return gulp.src(['./app/**/*.js', '!./app/bower_components/**','!./app/js/browserify/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('copy-bower-components', function () {
  return gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('browserify', function() {
  return gulp.src(['app/js/browserify/*'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(gulp.dest('./app/js/browserified'));

});
gulp.task('browserifyDist', function() {
return gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./dist/js'));
});


// // *** default task *** //
// gulp.task('default',
//   ['lint', 'browserify', 'connect']
// );
// // *** build task *** //
// gulp.task('build',
//   ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
// );

// *** default task *** //
gulp.task('default', function() {
    runSequence(
        ['connect'], ['watch']
    );
});


gulp.task('prepare',function(){
    runSequence(['clean'],
        ['cleanbundle'],
        ['compile'],
        ['lint', 'browserify']);
});
// *** build task *** //
gulp.task('build', function() {
    runSequence(
        ['cleanbundle'],
        ['compile'],
        ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components','connectDist']
    );
});


gulp.task('link',function(){
    gulp.src('./app/index.html')
        .pipe(linker({
            scripts: [ "./app/js/*/**.js ",'!./app/js/browserify/*.js'],
            startTag: '<!--SCRIPTS-->',
            endTag: '<!--SCRIPTS END-->',
            fileTmpl: '<script src="%s"></script>',
            appRoot: './app'
        }))
        .pipe(gulp.dest('./app')).pipe(livereload());
})


gulp.task('watch', function() {
    // watch many files
    livereload.listen();
    gulp.watch(['./app/**/*.html','./app/**/*.ts','./app/js/browserify/*.js']).on('change',function () {
        return runSequence(['clean'],
            ['cleanbundle'],
            ['compile'],
            ['lint'],
            ['browserify'],
            ['link']);
    });
});