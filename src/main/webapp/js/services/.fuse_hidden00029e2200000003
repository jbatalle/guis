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
                    his.content = response.status+" - PUT (ARN Service Statistics): "+response.data;
                    his.type = "INFO";
                    his.$save();
                    return json;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (IRootResourceAdministrastion): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
