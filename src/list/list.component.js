angular.module('notebook').component('noteList', {
    templateUrl: 'list/list.component.html',
    controller: function (NotesApi, $state) {
        this.items = NotesApi.query();
        this.$state = $state;
    }
})