angular.module('notebook').component('noteList', {
  templateUrl: 'list/list.component.html',
  controller: function (NotesApi, alertService) {
    const $ctrl = this
    $ctrl.loadNotes = () => $ctrl.items = NotesApi.query({search: $ctrl.search})
    $ctrl.loadNotes()
    $ctrl.onNewNoteCreated = () => {
      alertService.addAlert('notebook.detail.created')
      $ctrl.loadNotes()
    }
  }
})
