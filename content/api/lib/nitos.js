'use strict';

module.exports = function (app) {
    var request = require('request');

    var http = require('http');

    /* your app config here */
    app.use('/rest/nitos', function (req, res) {

        var url = app.mqnaas;
        if (req.headers['x-host'] !== undefined) url = req.headers['x-host'] + ':9000/mqnaas' + req.url;
        console.log(req.method + ": " + url);

        url = "https://83.212.32.165:8001/" + req.url;
        console.log(url);
        //console.log(app.mqnaas + req.url);
        var r = null;

        if (req.method === 'GET') {
            request({
                url: url,
                "rejectUnauthorized": false,
                headers: {

                }
            }).pipe(res);
        }
    });
}
