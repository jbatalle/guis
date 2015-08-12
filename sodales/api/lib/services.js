'use strict';

module.exports = function (app) {
    app.get('/service', function (req, res) {
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

    app.get('/service/:id', function (req, res, next) {
        if (req.params.id !== 'instance') {
            res.json(require('./services/' + req.params.id + '.json'));
        } else {
            next();
        }
    });

    app.post('/service', function (req, res, next) {
        res.json({
            'SvcID': '429d641d12d542c78e49db27b5ac528c',
            'createdAt': 1392214220313
        });
    });


    app.get('/system/tenants/:tenantId/svc/definitions', function (req, res) {
        if (req.params.tenantId === '1')
            res.json({
                "SVCIds": ["1_cod", "3_ebv", "2_power"]
            });
        else if (req.params.tenantId === '2')
            res.json({
                "SVCIds": ["1_cod"]
            });
        else if (req.params.tenantId === '4')
            res.json({
                "SVCIds": ["3_ebv"]
            });
    });

    app.get('/system/tenants/:tenantId/svc/definitions/:svcId/fvd/definitions', function (req, res) {
        if (req.params.svcId == "1_cod") {
            res.json({
                "FVDIds": ["1_cod"]
            });
        } else if (req.params.svcId == "3_ebv") {
            res.json({
                "FVDIds": ["3_ebv"]
            });
        } else if (req.params.svcId == "2_power") {
            res.json({
                "FVDIds": ["2_power"]
            });
        }
    });
};
