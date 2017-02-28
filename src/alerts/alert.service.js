angular.module('notebook').service('alertService', function (uuid) {
  let alerts = []

  this.getAlerts = () => alerts.map(alert => angular.copy(alert))
  this.addAlert = (messageOrAlertObject) => {
    alerts = [...alerts, {
      id: uuid(),
      type: messageOrAlertObject.type || 'success',
      message: typeof messageOrAlertObject === 'string' && messageOrAlertObject || messageOrAlertObject.message,
      params: messageOrAlertObject.params
    }]
  }
  this.removeAlert = alert => alerts = alerts.filter(a => a.id !== alert.id)
  this.flush = () => alerts = []
})
