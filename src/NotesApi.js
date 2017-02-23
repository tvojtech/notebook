angular.module('notebook').factory('NotesApi', $resource => 
    $resource('api/notes/:id', {id: '@id'}, {
        save: {
            method: 'POST',
            isArray: true // incorrect API!
        }
    })
)