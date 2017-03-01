angular.module('notebook').service('alertService', function (uuid) {
  let alerts = []
  let listeners = []

  this.getAlerts = () => alerts.map(alert => angular.copy(alert))
  this.addAlert = (messageOrAlertObject) => {
    alerts = [...alerts, {
      id: uuid(),
      type: messageOrAlertObject.type || 'success',
      message: typeof messageOrAlertObject === 'string' && messageOrAlertObject || messageOrAlertObject.message,
      params: messageOrAlertObject.params
    }]
    listeners.forEach(l => l())
  }
  this.removeAlert = alert => alerts = alerts.filter(a => a.id !== alert.id)
  this.flush = () => alerts = []

  this.addListener = listener => listeners = listeners.concat(listener)
  this.removeListener = listener => listeners = listeners.filter(l => l !== listener)
})
