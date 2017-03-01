const path = require('path')
const express = require('express')
const app = express()
require('dotenv').config()

const request = require('request')
app.all('/api/*', function (req, res) {
  let proxyUrl = process.env.PROXY_URL
  if (!proxyUrl.endsWith('/')) {
    proxyUrl = proxyUrl + '/'
  }
  const newurl = proxyUrl + req.url.split('/').slice(2).join('/')
  request(newurl).pipe(res)
})

const uiSourceDir = path.isAbsolute(process.env.UI_SOURCE) ? process.env.UI_SOURCE : path.join(process.cwd(), process.env.UI_SOURCE)
app.use(express.static(uiSourceDir))
app.get('/*', function (req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', {root: uiSourceDir})
})
app.listen(process.env.NODE_PORT || 3000)
