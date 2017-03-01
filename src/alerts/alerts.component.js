angular.module('notebook').component('alerts', {
  template: `
    <div uib-alert ng-repeat="alert in $ctrl.alerts track by alert.id" ng-class="'alert-' + (alert.type || 'warning')" 
      dismiss-on-timeout="10000" close="$ctrl.closeAlert(alert)">
      {{alert.message | translate:alert.params}}
    </div>
  `,
  controller: function (alertService) {
    this.closeAlert = alertService.removeAlert

    const processAlerts = () => {
      this.alerts = alertService.getAlerts()
    }

    this.$onInit = () => alertService.addListener(processAlerts)
    this.$onDestroy = () => alertService.removeListener(processAlerts)
  }
})
