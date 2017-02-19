angular.module('notebook').config(($urlRouterProvider, $stateProvider, $locationProvider) => {
    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/list')

    $stateProvider
        .state('notebook', {
            abstract: true,
            templateUrl: 'main.html'
        })
        .state('notebook.list', {
            url: '/list',
            template: '<note-list></note-list>',
        })
        .state('notebook.detail', {
            url: '/:id',
            template: '<note-detail></note-detail>',
        })
})