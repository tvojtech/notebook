angular.module('notebook').component('spinner', {
    bindings: {
        message: '@?'
    },
    template: `<div class="spinner"></div>{{$ctrl.message}}`
})