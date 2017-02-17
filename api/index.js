var path = require('path');
var express = require('express');
var app = express();

app.use('/resources', express.static(path.join(process.cwd(), '.tmp')))
app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: path.join(process.cwd(), '.tmp') });
});

app.listen(process.env.NODE_PORT || 3000);