angular.module('notebook').component('noteList', {
    templateUrl: 'resources/list/list.component.html',
    controller: function (NotesApi) {
        this.items = NotesApi.query();
    }
})