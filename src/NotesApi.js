angular.module('notebook').factory('NotesApi', ($resource) => 
    $resource('api/notes/:id', {id: '@id'})
)