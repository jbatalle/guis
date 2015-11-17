'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    /* your app config here */
    app.use('/rest/cpe', function (req, res) {
        console.log(req.method + ": " + req.url);
        var url = app.cpe + req.url;
	if(req.headers['x-host'] !== undefined) url = req.headers['x-host'] + req.url;
        console.log(url);
        var r = null;

        if (req.method === 'POST') {
            console.log("POST");
            console.log(req.body);
            if (!req.rawBody) {
                req.rawBody = "";
            }
            r = request.post({
                uri: url,
                body: req.rawBody
            }).pipe(res);
        } else if (req.method === 'PUT') {
            console.log(req.rawBody);
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
            r.pipe(request(url)).pipe(res) /*.setTimeout(2000)*/ ;
            return;
        }

    });
}
