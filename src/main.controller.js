angular.module('notebook').controller('MainController', function ($translate, $uibModal) {
    this.changeLang = lang => $translate.use(lang)
    this.isCurrentLang = lang => ($translate.use() || '').indexOf(lang) !== -1
    this.openCreateNote = () => $uibModal.open({
        bindToController: true,
        
    })
})