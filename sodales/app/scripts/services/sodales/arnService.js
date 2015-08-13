'use strict';

services.factory('arnService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
    return {
        put: function (data) {
            var promise = $http.post("rest/arn", data).then(function (response) {
                // convert the data to JSON and provide
                // it to the success function below
                var x2js = new X2JS();
                var json = x2js.xml_str2json(response.data);
                console.log(json);
                console.log(json.response.operation._type);
                console.log(json.response.operation._entity);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - POST (ARN Service Statistics): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        setUrl: function (url) {
            var promise = $http.put("rest/arn/setURL", url).then(function (response) {}, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (Set CPE URL) ";
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        }
    };
}]);
