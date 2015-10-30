'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    /* your app config here */
    app.use('/rest/mqnaas', function (req, res) {
        console.log(req.method + ": " + req.url);
        var url = app.mqnaas + req.url;
        //        var url = 'http://84.88.40.174:9000/mqnaas' + req.url;
        console.log(url);
        //console.log(app.mqnaas + req.url);
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
