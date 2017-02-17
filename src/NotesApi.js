angular.module('notebook').factory('NotesApi', ($resource) => 
    $resource('http://private-9aad-note10.apiary-mock.com/notes/:id', {id: '@id'})
)