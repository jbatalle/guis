'use strict';

module.exports = function (app) {
    app.get('/history', function (req, res) {
        var dir = __dirname + "/services";
        var files_ = [];
        var files = require('fs').readdirSync(dir);
        for (var i in files) {
            var name = files[i];
            files_.push(name.replace(/\.[^/.]+$/, ""));
        }
        res.json({
            'SVCIds': files_
        });
    });

    app.get('/history/:id', function (req, res, next) {
        if (req.params.id !== 'instance') {
            res.json(require('./services/' + req.params.id + '.json'));
        } else {
            next();
        }
    });

    app.post('/history', function (req, res, next) {
        res.json({
            'SvcID': '429d641d12d542c78e49db27b5ac528c',
            'createdAt': 1392214220313
        });
    });
};
