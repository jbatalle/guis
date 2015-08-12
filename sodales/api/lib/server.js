var express = require('express'),
    cors = require('cors'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    httpProxy = require('http-proxy'),
    //XmlStream = require('xml-stream'),

    app = express();

app.use(cors());
//app.use
//app.use(httpProxy);

function anyBodyParser(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        req.rawBody = data;
        next();
    });
}

app.configure(function () {
    app.use(anyBodyParser);
});

require('./monitoring')(app);
require('./proxy')(app);
//require(fs)(app);

app.configure(function () {
    app.use(express.bodyParser());
});


module.exports = app;
