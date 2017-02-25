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

const jsSources = () => gulp.src(['src/**/*.js', 'api/**/*.js'])
const e2eTestSources = () => gulp.src(['e2e/**/*.test.js'])

gulp.task('clean', () => {
  del(['.tmp/**', '.tmp', 'dist/**', 'dist'], {force: true})
})

gulp.task('server-dev', () => {
  // configure nodemon
  nodemon({
    // the script to run the app
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

gulp.task('eslint', () => jsSources().pipe(eslint()).pipe(eslint.format()).pipe(eslint.failAfterError()))

gulp.task('test:e2e', callback => {
  //noinspection Eslint
  e2eTestSources()
    .pipe(angularProtractor({
      configFile: 'protractor.conf.js',
      debug: false,
      autoStartStopServer: true
    }))
    .on('error', e => console.log(e))
    .on('end', callback)
})

gulp.task('default', done => {
  runSequence('clean', 'eslint', 'build-dev', 'server-dev', done)
})
