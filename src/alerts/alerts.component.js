angular.module('notebook').component('alerts', {
  template: `
    <div uib-alert ng-repeat="alert in $ctrl.getAlerts()" ng-class="'alert-' + (alert.type || 'warning')" 
      dismiss-on-timeout="10000" close="$ctrl.closeAlert(alert)">
      {{alert.message | translate:alert.params}}
    </div>
  `,
  controller: function (alertService) {
    this.getAlerts = alertService.getAlerts
    this.closeAlert = alertService.removeAlert
  }
})
