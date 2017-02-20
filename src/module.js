angular.module(
    'notebook',
    [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'ngTouch',
        'pascalprecht.translate'
    ]
).config($translateProvider => {
    $translateProvider.useSanitizeValueStrategy(null)
    $translateProvider.useStaticFilesLoader({
        prefix: '/locales/locale_',
        suffix: '.json'
    }).determinePreferredLanguage()
})