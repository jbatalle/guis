'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    /* your app config here */
    app.use('/rest/tson', function (req, res) {

        var url = app.mqnaas;
        if (req.headers['x-host'] !== undefined) url = req.headers['x-host'] + '' + req.url;
        console.log(req.method + ": " + url);

        var r = null;
        if (req.method === 'POST') {
            r = request.post({
                uri: url,
                body: req.body
            });
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
            request({
                url: url,
                headers: {

                }

            }).pipe(res);
            //r = request(url);
            //r.pipe(request(url)).pipe(res) /*.setTimeout(2000)*/ ;
            //return;
        }
    });
}
