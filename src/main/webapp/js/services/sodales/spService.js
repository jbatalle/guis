'use strict';

services.factory('spService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
        console.log("Service Provider Service");
        return {
            list: function () {
                var promise = $http.get("rest/sp").then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Create Service Provider): "+response.data;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Create Service Provider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getSP: function (id) {
                var promise = $http.get("rest/sp/"+id).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Create Service Provider): "+response.data;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Create Service Provider): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            createSP: function (data) {//data in json format {"name":"SP4"}
                var promise = $http.post("rest/sp/", data).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Service Provider): "+response.data;
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
                    his.content = response.status+" - POST (Create Service Provider): "+response.data;
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
                    his.content = response.status+" - REMOVE (Create Service Provider): "+response.data;
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
            }
        };
    }]);
