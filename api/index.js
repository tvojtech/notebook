const path = require('path');
const express = require('express');
const app = express();

const request = require('request');
app.all('/api/*', function (req, res) {
    const newurl = 'http://private-9aad-note10.apiary-mock.com/' + req.url.split('/').slice(2).join('/');
    request(newurl).pipe(res);
});
app.use('/resources', express.static(path.join(process.cwd(), '.tmp')))
app.all('/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: path.join(process.cwd(), '.tmp') });
});

app.listen(process.env.NODE_PORT || 3000);