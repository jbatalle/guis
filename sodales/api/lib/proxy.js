'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    /* your app config here */
    app.use('/rest/mqnaas', function (req, res) {
        console.log(req.method + ": " + req.url);
        var url = 'http://localhost:9000/mqnaas' + req.url;
//        var url = 'http://84.88.40.174:9000/mqnaas' + req.url;
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
            r = request(url);
            r.pipe(request(url)).pipe(res) /*.setTimeout(2000)*/ ;
            return;
        }

        console.log("Prepare request");
        console.log(req.rawBody);
        /*request.put({
            uri: url,
            body: req.rawBody,
            headers: {
                'Content-Type': 'application/xml'
            }
        }).pipe(res);*/
        //req.pipe(r).pipe(res);

        // do the piping
        /* if (!req.rawBody) {
             console.log("Body empty");
             //request.put(url).pipe(res);
             request.put({
                 url: url,
                 body: ""
             }).pipe(res);
             //req.pipe(r).pipe(res);
         } else {
             console.log("Body NOT empty");
             r.pipe(request(url)).pipe(res);
         }*/
    });
}
