'use strict';

services.factory('endpointService', ['$http', 'HistoryService', function ($http, HistoryService) {
        return {
            get: function () {
                var promise = $http.get("rest/endpoint").then(function (response) {
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get Endpoint): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            post: function (ip, port) {
                var promise = $http.post("rest/endpoint/"+ip+"/"+port).then(function (response) {
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Update Endpoint VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
