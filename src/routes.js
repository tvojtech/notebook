angular.module('notebook').config(($urlRouterProvider, $stateProvider, $locationProvider) => {
    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/list')

    $stateProvider
        .state('notebook', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('notebook.list', {
            url: '/list',
            template: '<note-list></note-list>',
            controllerAs: '$ctrl'
        })
        .state('notebook.list.detail', {
            url: '/:id',
            template: 'detail',
            controllerAs: '$ctrl'
        })
})