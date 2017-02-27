angular.module('notebook').component('noteList', {
  templateUrl: 'list/list.component.html',
  controller: function (NotesApi) {
    this.loadNotes = () => this.items = NotesApi.query({search: this.search})
    this.loadNotes()
  }
})
