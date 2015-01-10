'use strict';

services.factory('viService', ['$http', 'HistoryService', function ($http, HistoryService) {
        console.log("Service Provider Service");
        return {
            list: function () {
                var promise = $http.get("rest/vi").then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI List): "+response.data;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI List): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getVI: function (id) {
                var promise = $http.get("rest/vi/"+id).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI): "+response.data.name;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            createVI: function (data) {//data in json format {"name":"SP4"}
                var promise = $http.post("rest/vi/", data).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create VI)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            addResourceToVI: function (viId, resName, resType) {
                var promise = $http.get("rest/vi/"+viId+"/name/"+resName+"/type/"+resType).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Add Resource To VI)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Add Resource To VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getVIByName: function (viId) {
                var promise = $http.get("rest/vi/getVIByName/"+viId).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI): "+response.data.name;
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            updateStatus: function (viId, status) {
                var promise = $http.get("rest/vi/updateStatus/"+viId+"/"+status).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Update VI status)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Update VI status): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
        };
    }]);
