const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const notify = require('node-notify')
const concat = require('gulp-concat')
const del = require('del')
const runSequence = require('run-sequence')
const watch = require('gulp-watch')
const babel = require("gulp-babel")
const sass = require("gulp-sass")
const docker = require("gulp-docker")

gulp.task('clean', done => {
    del('.tmp/**', {force: true})
    del('dist/**', {force: true})
    del('.tmp', {force: true})
    del('dist', {force: true})
    done()
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
    watch('src/**/*.scss', () => runSequence('sass'))
})

gulp.task('build-dev', done => {
    gulp.src('public/**/*').pipe(gulp.dest('.tmp'))
    gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('.tmp'))
    gulp.src('src/**/*.html').pipe(gulp.dest('.tmp'))
    gulp.src('bower_components/**/*').pipe(gulp.dest('.tmp/bower_components'))
    runSequence('sass')
    done()
})

gulp.task('sass', done => {
    gulp.src('src/**/*.scss').pipe(sass()).pipe(gulp.dest('.tmp'))
    done()
})

gulp.task('concat', function() {
    gulp.src('src/**/*.js').pipe(concat('main.js')).pipe(gulp.dest('dist'));
});

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
    runSequence('build-dev')
    runSequence('concat')

    gulp.src('.tmp/**/*.js')

    runSequence('docker')
})

gulp.task('default', done => {
    runSequence('clean', 'build-dev', 'server-dev', done)
})