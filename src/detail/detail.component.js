angular.module('notebook').component('noteDetail', {
    templateUrl: 'detail/detail.component.html',
    controller: function ($stateParams, NotesApi) {
        const $ctrl = this;
        $ctrl.loading = true;
        $ctrl.item = NotesApi.get({id: $stateParams.id})
        $ctrl.item.$promise.finally(function() {
            $ctrl.loading = false
        })
    }
})