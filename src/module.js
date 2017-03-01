angular.module(
    'notebook',
  [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngTouch',
    'pascalprecht.translate',
    'angular-uuid'
  ]
).config($translateProvider => {
  $translateProvider.useSanitizeValueStrategy(null)
  $translateProvider.useStaticFilesLoader({
    prefix: '/locales/locale_',
    suffix: '.json'
  }).determinePreferredLanguage()
  $translateProvider.fallbackLanguage(['en'])
})
