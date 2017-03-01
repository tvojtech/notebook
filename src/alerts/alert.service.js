angular.module('notebook').service('alertService', function (uuid) {
  let alerts = []
  let listeners = []

  const callListeners = () => listeners.forEach(l => l())

  this.getAlerts = () => alerts.map(alert => angular.copy(alert))
  this.addAlert = (messageOrAlertObject) => {
    alerts = [...alerts, {
      id: uuid(),
      type: messageOrAlertObject.type || 'success',
      message: typeof messageOrAlertObject === 'string' && messageOrAlertObject || messageOrAlertObject.message,
      params: messageOrAlertObject.params
    }]
    callListeners()
  }
  this.removeAlert = alert => {
    alerts = alerts.filter(a => a.id !== alert.id)
    callListeners()
  }
  this.flush = () => {
    alerts = []
    callListeners()
  }

  this.addListener = listener => listeners = listeners.concat(listener)
  this.removeListener = listener => listeners = listeners.filter(l => l !== listener)
})
