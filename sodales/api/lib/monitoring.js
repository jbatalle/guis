'use strict';

module.exports = function (app) {
    app.get('/monitoring/:element/:id/:resource/:resourceId?*', function (req, res, next) {
        console.log(req.param('start'));
        console.log(req.param('end'));
        var monitoring_object = {};
        var valors = [];
        var response ={}; 

        var date_start = parseInt(req.param('start'));
        var data_end = parseInt(req.param('end'));
        var total = data_end - date_start;

        console.log("diff temporal:" + total);
        if (req.params.resource == "cpu" || req.params.resource == "memory" || req.params.resource == "disk" || req.params.resource == "io"
            || req.params.resource == "power") {
            var i = 0;
            while (i < total) {

                var new_object = {};

                new_object.timestamp = date_start + i;
                if (req.params.resource == "cpu") {
                    //console.log("el temps es de "+new_object.timestamp);
                    new_object.usage_percent = Math.round(Math.random() * (70 - 40) + parseInt(40));
                } else if (req.params.resource == "memory") {
                    new_object.total = 4096;
                    new_object.used = Math.round(Math.random() * (3800 - 2500) + parseInt(2500));
                    new_object.cached = Math.round(Math.random() * (500 - 350) + parseInt(350));
                } else if (req.params.resource == "disk") {
                    var partitions = [];
                    var partitions_1 = {};
                    var partitions_2 = {};
                    partitions_1.name = "/";
                    partitions_1.used = Math.round(Math.random() * (8000000000 - 500000000) + parseInt(500000000));
                    partitions_1.total = 10737418240;
                    partitions_2.name = "/";
                    partitions_2.used = Math.round(Math.random() * (8000000000 - 500000000) + parseInt(500000000));
                    partitions_1.total = 10737418240;
                    partitions.push(partitions_1);
                    partitions.push(partitions_2);
                    new_object.partitions = partitions;
                } else if (req.params.resource == "io") {
                    new_object.write_bytes_per_second = Math.round(Math.random() * (13000 - 10000) + parseInt(10000));
                    new_object.write_count = Math.round(Math.random() * (200 - 100) + parseInt(100));
                    new_object.read_bytes_per_second = Math.round(Math.random() * (1300 - 1000) + parseInt(1000));
                    new_object.read_count = Math.round(Math.random() * (13000 - 10000) + parseInt(10000));

                }else if(req.params.resource == "power"){



                    new_object.power_active_p1 = 65000.0;
                     new_object.power_active_p2 = 180000.0;
                     new_object.power_active_p3 =  54000.0;


                      new_object.current_l1 = 310.0;
                     new_object.current_l2 = 850.0;
                     new_object.current_l3 = 260.0;
                }
                valors.push(new_object);
                i = i + 5;

            };
            //console.log(JSON.stringify(response));
            var _data = {};

            _data.data = valors;

            response = _data;

        } else {
            monitoring_object = require('./monitoring/' + req.params.resource + '.json');
            response = monitoring_object;
        }
        res.json(response);
    });

};
