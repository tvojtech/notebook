angular.module('notebook').service('confirmDialog', function ($uibModal) {
  this.open = () =>
    $uibModal.open({
      component: 'confirm',
      keyboard: false,
      backdrop: 'static'
    }).result
}).component('confirm', {
  bindings: {
    close: '&',
    dismiss: '&'
  },
  template: `
    <div class="modal-header">
      <h3 class="modal-title">{{'notebook.common.confirm.title' | translate}}</h3>
    </div>
    <div class="modal-body">
      {{ 'notebook.common.confirm.text' | translate }}
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">
            <spinner ng-if="$ctrl.saving"></spinner>
            {{ 'notebook.common.confirm.ok' | translate }}
        </button>
        <button class="btn btn-secondary" type="button" ng-click="$ctrl.cancel()">
            {{ 'notebook.common.confirm.cancel' | translate }}
        </button>
    </div>
  `,
  controller: function () {
    this.ok = () => this.close()
    this.cancel = () => this.dismiss()
  }
})
