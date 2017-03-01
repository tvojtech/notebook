angular.module('notebook').component('breadcrumbs', {
  template: `
    <ol class="breadcrumb">
      <li ng-repeat="crumb in $ctrl.crumbs" ng-class="{active: !crumb.state}">
        <a href="#" ng-if="crumb.state" ng-click="$ctrl.navigate(crumb)">{{crumb.label | translate}}</a>
        <span ng-if="!crumb.state">{{crumb.label | translate}}</span>
      </li>
    </ol>
  `,
  controller: function ($state, $rootScope) {
    const $ctrl = this
    $ctrl.crumbs = $state.$current.data.breadcrumbs
    $ctrl.navigate = crumb => $state.go(crumb.state, crumb.stateParams || {})
    $rootScope.$on('$stateChangeSuccess', () => {
      $ctrl.crumbs = $state.$current.data.breadcrumbs
    })
  }
})