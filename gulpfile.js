/* eslint-disable no-console */
const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const concat = require('gulp-concat')
const del = require('del')
const runSequence = require('run-sequence')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const docker = require('gulp-docker')
const eslint = require('gulp-eslint')
const angularProtractor = require('gulp-angular-protractor')
const inject = require('gulp-inject')
const bowerFiles = require('main-bower-files')
const path = require('path')
const ngmin = require('gulp-ngmin')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const htmlmin = () => require('gulp-htmlmin')({removeComments: true, collapseWhitespace: true})
const jsonMinify = require('gulp-json-minify')
const ngAnnotate = require('gulp-ng-annotate')
const gulpOrder = require('gulp-order')
const filter = require('gulp-filter')

const tempDest = '.tmp'
const distDest = 'dist'
const jsUiSources = ['src/**/*.js']
const jsApiSources = ['api/**/*.js']
const readJsSources = () => gulp.src(jsUiSources.concat(jsApiSources))
const e2eTestSources = () => gulp.src(['e2e/**/*.test.js'])

gulp.task('clean', () => {
  del(['.tmp/**', '.tmp', 'dist/**', 'dist'], {force: true})
})

gulp.task('server-dev', ['watch'], () => {
  nodemon({
    script: 'api/index.js',
    // this listens to changes in any of these files/routes and restarts the application
    watch: ['api/**/*.js'],
    ext: 'js'
  })
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

gulp.task('test')

gulp.task('copy-public', () => gulp.src('public/**/*').pipe(gulp.dest(tempDest)))
gulp.task('build-public', ['copy-public'], () =>
  gulp.src('index.html', {cwd: tempDest})
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower', addRootSlash: false}))
    .pipe(inject(gulp.src(['module.js', '**/*.js', '**/*.css', '!bower_components/**'], {read: false, cwd: tempDest}), {
      addRootSlash: false,
      relative: true
    }))
    .pipe(gulp.dest(tempDest))
)
gulp.task('build-js', () => gulp.src('src/**/*.js').pipe(babel()).on('error', console.log).pipe(gulp.dest(tempDest)))
gulp.task('build-html', () => gulp.src('src/**/*.html').pipe(gulp.dest(tempDest)))
gulp.task('build-locales', () => gulp.src('locales/**/*').pipe(gulp.dest(path.join(tempDest, 'locales'))))
gulp.task('build-bower', () => gulp.src('bower_components/**/*').pipe(gulp.dest(path.join(tempDest, 'bower_components'))))
gulp.task('build-sass', () => gulp.src('src/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('.tmp')))

gulp.task('build-dev', done => runSequence(
  ['build-js', 'build-html', 'build-locales', 'build-sass', 'build-bower'],
  'build-public',
  done
  )
)

gulp.task('watch-public', () => gulp.watch('public/**/*', ['build-dev']))
gulp.task('watch-js', () => gulp.watch('src/**/*.js', ['build-dev']))
gulp.task('watch-html', () => gulp.watch('src/**/*.html', ['build-dev']))
gulp.task('watch-locales', () => gulp.watch('locales/**/*', ['build-dev']))
gulp.task('watch-bower', () => gulp.watch('bower_components/**/*', ['build-dev']))
gulp.task('watch-sass', () => gulp.watch('src/**/*.scss', ['build-dev']))

gulp.task('watch', ['watch-public', 'watch-js', 'watch-html', 'watch-locales', 'watch-bower', 'watch-sass'])

gulp.task('build-html-prod', () => gulp.src(path.join(tempDest, '**/*.html')).pipe(htmlmin()).pipe(gulp.dest(distDest)))
gulp.task('build-js-prod', ['build-html-prod'], () =>
  // todo: add templates to template cache
  gulp.src(bowerFiles())
    .pipe(filter('**/*.js'))
    .pipe(gulp.src('src/**/*.js'))
    // .pipe(gulp.src([path.join(tempDest, '**/*.js'), path.join('!' + tempDest, 'bower_components/**/*.js')]))
    .pipe(gulpOrder([
      '**/angular/**/*.js',
      'bower_components/**/*.js',
      'module.js',
      '**/*.js'
    ]))
    .pipe(ngAnnotate())
    .pipe(concat('bundle.js')).on('error', console.log)
    // .pipe(ngmin())
    // .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(distDest))
)
gulp.task('build-css-prod', () =>
  gulp.src(path.join(tempDest, '/**/*.css'))
    .pipe(concat('app.css'))
    .on('error', console.log)
    .pipe(uglifycss())
    .pipe(gulp.dest(distDest))
)
gulp.task('build-locales-prod', () => gulp.src(path.join(tempDest, 'locales/**/*')).pipe(jsonMinify()).pipe(gulp.dest(path.join(distDest, 'locales'))))
gulp.task('copy-public-prod', () => gulp.src('public/**/*').pipe(gulp.dest(distDest)))
gulp.task('build-index-prod', () =>
  gulp.src('index.html', {cwd: 'public'})
    .pipe(inject(gulp.src(['bundle.js', 'app.css'], {
      read: false,
      cwd: distDest
    }), {addRootSlash: false, relative: true, ignorePath: '../dist'}))
    .pipe(htmlmin())
    .pipe(gulp.dest(distDest))
)

gulp.task('build-prod', done => runSequence(
  ['build-js-prod', 'build-css-prod', 'build-locales-prod'],
  'copy-public-prod',
  'build-index-prod',
  done
  )
)

gulp.task('docker', () => {
  new docker(gulp, {
    sidekick: {
      dockerfile: '.'
    }
  })
  gulp.start('docker:image')
})

gulp.task('build', done => runSequence(['clean', 'eslint', 'test'], 'build-dev', 'build-prod', done))

gulp.task('default', done => runSequence(['clean', 'eslint'], 'build-dev', 'server-dev', done))
