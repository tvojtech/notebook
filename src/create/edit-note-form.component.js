angular.module('notebook').component('editNoteForm', {
  bindings: {
    note: '=',
    form: '='
  },
  templateUrl: 'create/edit-note-form.component.html'
})
