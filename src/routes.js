angular.module('notebook').config(($urlRouterProvider, $stateProvider, $locationProvider) => {
    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/notes')

    $stateProvider
        .state('notebook', {
            abstract: true,
            templateUrl: 'main.html'
        })
        .state('notebook.list', {
            url: '/notes',
            template: '<note-list></note-list>',
            data: {
                breadcrumbs: [
                    {label: 'notebook.breadcrumbs.list'}
                ]
            }
        })
        .state('notebook.detail', {
            url: '/notes/:id',
            template: '<note-detail></note-detail>',
            data: {
                breadcrumbs: [
                    {label: 'notebook.breadcrumbs.list', state: 'notebook.list'},
                    {label: 'notebook.breadcrumbs.detail'}
                ]
            }
        })
})