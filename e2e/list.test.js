describe('note list', function () {
  it('should filtering work', function () {
    browser.get('/notes')

    element(by.model('$ctrl.search')).sendKeys('Jogging')

    let noteList = element.all(by.css('.list-group-item'))
    // searching is delegated to server and apiary mock always returns 2 items
    expect(noteList.count()).toEqual(2)
    expect(noteList.get(0).getText()).toEqual('Jogging in park')

    element(by.model('$ctrl.search')).clear()

    noteList = element.all(by.css('.list-group-item'))
    expect(noteList.count()).toEqual(2)
    expect(noteList.get(0).getText()).toEqual('Jogging in park')
    expect(noteList.get(1).getText()).toEqual('Pick-up posters from post-office')

  })
})
