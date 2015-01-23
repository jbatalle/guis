'use strict';

services.factory('arnService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
        console.log("ARN Service");
        return {
            put: function (data) {
                var promise = $http.post("rest/arn", data).then(function (response) {
                    // convert the data to JSON and provide
                    // it to the success function below
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(response.data);
                    var his = new HistoryService();
                    console.log(json);
                    console.log(json.response.operation._type);
                    console.log(json.response.operation._entity);
                    his.content = response.status+" - POST (ARN Service Statistics): "+json.response.operation._type+" - "+json.response.operation._entity;
                    his.type = "INFO";
                    his.$save();
                    return json;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (ARN Service Statistics): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            setUrl: function (url) {
                var promise = $http.put("rest/arn/setURL", url).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - PUT (Set CPE URL) ";
                    his.type = "INFO";
                    his.$save();
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - PUT (Set CPE URL) ";
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
