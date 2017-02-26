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
const path = require('path')

const tempDest = '.tmp'
const jsUiSources = ['src/**/*.js']
const jsApiSources = ['api/**/*.js']
const readJsSources = () => gulp.src(jsUiSources.concat(jsApiSources))
const readUiSources = () => gulp.src(jsUiSources.concat(['!bower_components/**/*.js ']))
const e2eTestSources = () => gulp.src(['e2e/**/*.test.js'])

gulp.task('clean', () => {
  del(['.tmp/**', '.tmp', 'dist/**', 'dist'], {force: true})
})

gulp.task('server-dev', () => {
  nodemon({
    script: 'api/index.js',
    // this listens to changes in any of these files/routes and restarts the application
    watch: ['api/**/*.js'],
    ext: 'js'
  })
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

gulp.test('test')

gulp.task('copy-public', () => gulp.src('public/**/*').pipe(gulp.dest(tempDest)))
gulp.task('build-public', ['copy-public'], () => {
  return gulp.src('index.html', {cwd: tempDest})
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', addRootSlash: false}))
    .pipe(inject(gulp.src(['module.js', '**/*.js', '**/*.css', '!bower_components/**'], {read: false, cwd: tempDest}), {
      addRootSlash: false,
      relative: true
    }))
    .pipe(gulp.dest(tempDest))
})
gulp.task('build-js', () => gulp.src('src/**/*.js').pipe(babel()).on('error', console.log).pipe(gulp.dest(tempDest)))
gulp.task('build-html', () => gulp.src('src/**/*.html').pipe(gulp.dest(tempDest)))
gulp.task('build-locales', () => gulp.src('locales/**/*').pipe(gulp.dest(path.join(tempDest, 'locales'))))
gulp.task('build-bower', () => gulp.src('bower_components/**/*').pipe(gulp.dest(path.join(tempDest, 'bower_components'))))
gulp.task('build-sass', () => gulp.src('src/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('.tmp')))

gulp.task('build-dev', () => runSequence(
  ['build-js', 'build-html', 'build-locales', 'build-sass', 'build-bower'],
  'build-public'
  )
)

gulp.task('watch-public', () => watch('public/**/*', runSequence('build-public')))
gulp.task('watch-js', () => watch('src/**/*.js', runSequence('build-js')))
gulp.task('watch-html', () => watch('src/**/*.html', runSequence('build-html')))
gulp.task('watch-locales', () => watch('locales/**/*', runSequence('build-locales')))
gulp.task('watch-bower', () => watch('bower_components/**/*', runSequence('build-bower')))
gulp.task('watch-sass', () => watch('src/**/*.scss', runSequence('build-sass')))

gulp.task('watch', ['watch-public', 'watch-js', 'watch-html', 'watch-locales', 'watch-bower', 'watch-sass'])

gulp.task('build', () => {
  runSequence(['clean', 'eslint', 'test'], 'build-dev', 'concat', 'docker')
})

gulp.task('default', done => {
  runSequence(['clean', 'eslint'], 'build-dev', 'server-dev', done)
})
