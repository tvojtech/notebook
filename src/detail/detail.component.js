angular.module('notebook').component('noteDetail', {
  templateUrl: 'detail/detail.component.html',
  controller: function ($state, $stateParams, NotesApi, confirmDialog) {
    const $ctrl = this
    $ctrl.loading = true
    $ctrl.item = NotesApi.get({id: $stateParams.id})
    $ctrl.item.$promise.finally(function () {
      $ctrl.loading = false
    })
    $ctrl.deleteNote = () => {
      confirmDialog.open().then(() => {
        $ctrl.deleting = true
        NotesApi.delete({id: $stateParams.id}).$promise.then(() => $state.go('notebook.list'))
      })
    }
    $ctrl.startEditing = () => {
      $ctrl.edit = true
      $ctrl.itemClone = $ctrl.item.toJSON()
    }
    $ctrl.cancelEditing = () => {
      $ctrl.edit = false
      $ctrl.itemClone = undefined
    }
    $ctrl.saveEdit = () => {
      $ctrl.saving = true
      Object.keys($ctrl.itemClone).forEach(key => $ctrl.item[key] = $ctrl.itemClone[key])
      $ctrl.item.$update()
        .then(() => $ctrl.edit = false)
        .finally(() => {
          $ctrl.saving = false
          $ctrl.itemClone = undefined
        })
    }
  }
})
