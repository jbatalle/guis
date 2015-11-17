'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    app.use('/rest/arn', function (req, res) {
        var url = app.arn;
        console.log(req.method + ": " + url);
	console.log(req.headers);
	console.log(req.headers['x-host']);
	if(req.headers['x-host'] !== undefined) url = req.headers['x-host'];
        var r = null;

        if (req.method === 'POST') {
            if (!req.rawBody) {
                req.rawBody = "";
            }
            r = request.post({
                uri: url,
                body: req.rawBody
            }).pipe(res);
        } else if (req.method === 'PUT') {
            if (!req.rawBody) {
                req.rawBody = "";
            }
            r = request.put({
                uri: url,
                body: req.rawBody,
                headers: {
                    'Content-Type': 'application/xml'
                }
            }).pipe(res);
        } else if (req.method === 'DELETE') {
            r = request.del({
                uri: url,
                body: ''
            }).pipe(res);
        } else {
            r = request(url);
            r.pipe(request(url)).pipe(res).setTimeout(2000);
            return;
        }

    });
}
