# Notebook

Simple application implementing CRUD operations for notes.

## Serving static files and API proxying

Server is implemented in Node.js in `api/index.js`. 

It serves static resources located in directory specified by `UI_SOURCE` property in `.env` file.

API proxy forwards all requests with url pattern `/api/*` to url specified by `PROXY_URL` property from `.env`.

## Client side

UI is implemented using AngularJS, Bootstrap and SASS.

## Prerequisites

- Node.js - tested with 7.5.0
- npm - shipped with Node
- bower - run `npm i -g bower` to install
- gulp - run `npm i -g gulp-cli` to install 
- protractor - run `npm install -g protractor` to install, then `webdriver-manager update` to configure selenium web driver

## Devel setup

Navigate to project directory and run `npm i && bower i` to install dependencies. Then run `gulp` to start Node.js server.

Try `http://localhost:3000` in browser.

## Build

Build is implemented as `gulp` tasks.

- default task - builds application, runs dev server and start watching sources
- `clean` - removes build directories
- `eslint` - runs source static analysis 
- `test:e2e` - run `protractor` tests, by default tests run against local server (can be changed in `protractor.conf.js`), server must be started manually before running tests
- `build` - builds production ready version of the application - sources minification and concatenation applied

NOTE: `build` task currently does not work properly. It does not produce runnable code. 
