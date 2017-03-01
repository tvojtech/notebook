angular.module('notebook').component('createNote', {
  templateUrl: 'create/create-note.component.html',
  bindings: {
    close: '&',
    dismiss: '&'
  },
  controller: function (NotesApi) {
    this.note = {}
    this.ok = () => {
      if (!this.form.$valid) {
        return
      }
      this.saving = true
      this.error = false
      NotesApi.save(this.note).$promise
                .then(notes => this.close({$value: notes}))
                .catch(() => this.error = true)
                .finally(() => this.saving = false)
    }
    this.cancel = () => this.dismiss({$value: 'cancel'})
  }
})
