angular.module('notebook').controller('MainController', function ($translate) {
  this.changeLang = lang => $translate.use(lang)
  this.isCurrentLang = lang => ($translate.use() || '').indexOf(lang) !== -1
})