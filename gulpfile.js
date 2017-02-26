/* eslint-disable no-console */
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const del = require('del')
const runSequence = require('run-sequence')
const watch = require('gulp-watch')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const docker = require('gulp-docker')
const eslint = require('gulp-eslint')
const angularProtractor = require('gulp-angular-protractor')
const inject = require('gulp-inject')
const bowerFiles = require('main-bower-files')

const jsUiSources = ['src/**/*.js']
const jsApiSources = ['api/**/*.js']
const readJsSources = () => gulp.src(jsUiSources.concat(jsApiSources))
const readUiSources = () => gulp.src(jsUiSources)
const readApiSources = () => gulp.src(jsApiSources)
const e2eTestSources = () => gulp.src(['e2e/**/*.test.js'])

gulp.task('clean', () => {
  del(['.tmp/**', '.tmp', 'dist/**', 'dist'], {force: true})
})

const index = (jsFiles, cssFiles) => {
  const target = gulp.src('public/index.html')
  target
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', addRootSlash: false}))
    .pipe(inject(gulp.src(jsFiles, {read: false}), {addRootSlash: false}))
    .pipe(inject(gulp.src(cssFiles, {read: false}), {addRootSlash: false}))
    .pipe(gulp.dest('.tmp'))
}

gulp.task('server-dev', () => {
  nodemon({
    script: 'api/index.js',
    // this listens to changes in any of these files/routes and restarts the application
    watch: ['api/**/*.js'],
    ext: 'js'
  })
  watch('public/**/*', () => runSequence('build-dev'))
  watch('src/**/*.js', () => runSequence('build-dev'))
  watch('src/**/*.html', () => runSequence('build-dev'))
  watch('locales/**/*', () => runSequence('build-dev'))
  watch('src/**/*.scss', () => runSequence('sass'))
})

gulp.task('build-dev', done => {
  gulp.src('public/**/*').pipe(gulp.dest('.tmp'))
  gulp.src('src/**/*.js').pipe(babel()).on('error', console.log).pipe(gulp.dest('.tmp'))
  gulp.src('src/**/*.html').pipe(gulp.dest('.tmp'))
  gulp.src('locales/**/*').pipe(gulp.dest('.tmp/locales'))
  gulp.src('bower_components/**/*').pipe(gulp.dest('.tmp/bower_components'))
  runSequence('sass')
  index('src/**/*.js', '.tmp/app.css')
  done()
})

gulp.task('sass', done => {
  gulp.src('src/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('.tmp'))
  done()
})

gulp.task('concat', function () {
  gulp.src('src/**/*.js').pipe(concat('main.js')).on('error', console.log).pipe(gulp.dest('dist'))
})

gulp.task('docker', () => {
  new docker(gulp, {
    sidekick: {
      dockerfile: '.'
    }
  })
  gulp.start('docker:image')
})

gulp.task('build', () => {
  runSequence('clean')
  runSequence('eslint')
  runSequence('build-dev')
  runSequence('concat')
  runSequence('docker')
})

gulp.task('eslint', () => readJsSources().pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError()))

gulp.task('test:e2e', done => {
  //noinspection Eslint
  e2eTestSources()
    .pipe(angularProtractor({
      configFile: 'protractor.conf.js',
      debug: false,
      autoStartStopServer: true
    }))
    .on('error', e => console.log(e))
    .on('end', done)
})

gulp.task('default', done => {
  runSequence('clean', 'eslint', 'build-dev', 'server-dev', done)
})
