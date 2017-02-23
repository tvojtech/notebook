angular.module('notebook').component('createNoteButton', {
    bindings: {
        onCreate: '&?'
    },
    template: `
         <button class="button-create" ng-click="$ctrl.openCreateNote()">
            <!--{{'notebook.create' | translate}}-->
        </button>       
    `,
    controller: function ($uibModal) {
        this.openCreateNote = () => {
            $uibModal.open({
                component: 'createNoteForm',
                keyboard: false,
                backdrop: 'static'
            }).result
                .then(() => this.onCreate && this.onCreate())
        }
    }
})