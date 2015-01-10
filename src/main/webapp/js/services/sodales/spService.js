'use strict';

services.factory('spService', ['$http', 'HistoryService', function ($http, HistoryService) {
        console.log("Service Provider Service");
        return {
            list: function () {
                var promise = $http.get("rest/sp").then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP List): "+response.data.length;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP List): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getSP: function (id) {
                var promise = $http.get("rest/sp/"+id).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP Info): "+response.name;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP Info): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            createSP: function (data) {//data in json format {"name":"SP4"}
                var promise = $http.post("rest/sp/", data).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Service Provider)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Service Provider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            addViToSP: function (spId, viId) {
                var promise = $http.get("rest/sp/"+spId+"/vi/"+viId).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Add "+viId+" to "+spId+")";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Service Provider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            removeVIOfSP: function (spId, viId) {
                var promise = $http.delete("rest/sp/"+spId+"/vi/"+viId).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - REMOVE (Remove VI "+viId+"): ";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - REMOVE (Create Service Provider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getSPByName: function (id) {
                var promise = $http.get("rest/sp/getSPByName/"+id).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP Info): "+response.data.name;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get SP Info): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
