var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use(serveStatic('.tmp', { 'index': ['index.html'] }))
app.listen(9012, function () {
    console.log('The server is running on port 9012');
});