//module.exports = require('./lib/server');

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
//unused
app.mqnaas = 'http://84.88.40.174:9000/mqnaas';
app.arn = 'http://fibratv.dtdns.net:41080/cgi-bin/xml-parser.cgi';
app.cpe = 'http://fibratv.dtdns.net:41081';

app.configure(function () {
    app.use(anyBodyParser);
});

require('./lib/proxy')(app);
require('./lib/arn')(app);
require('./lib/cpe')(app);
require('./lib/nitos')(app);
require('./lib/tson')(app);
//require(fs)(app);

app.configure(function () {
    app.use(express.bodyParser());
});


module.exports = app;
