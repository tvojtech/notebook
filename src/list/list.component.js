angular.module('notebook').component('noteList', {
    templateUrl: 'list/list.component.html',
    controller: function (NotesApi) {
        this.items = NotesApi.query()
        this.forceUpdate = () => this.items = NotesApi.query()
    }
})