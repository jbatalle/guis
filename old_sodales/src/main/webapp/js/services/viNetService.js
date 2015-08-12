'use strict';

services.factory('viNetService', ['$http', 'HistoryService', function ($http, HistoryService) {
        console.log("Service Provider Service");
        return {
            list: function () {
                var promise = $http.get("rest/viNet").then(function (response) {
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get Virtual Network List): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getVI: function (id) {
                var promise = $http.get("rest/viNet/"+id).then(function (response) {
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get Virtual Network): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            createVI: function (data) {//data in json format {"name":"SP4"}
                var promise = $http.post("rest/viNet/", data).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Virtual Network)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Create Virtual Network): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            addResourceToVI: function (viId, resName, resType) {
                var promise = $http.get("rest/viNet/"+viId+"/name/"+resName+"/type/"+resType).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Add Resource To Virtual Network)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Add Resource To Virtual Network): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            getVIByName: function (viId) {
                var promise = $http.get("rest/viNet/getVIByName/"+viId).then(function (response) {
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET (Get Virtual Network): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            updateStatus: function (viId, status) {
                var promise = $http.get("rest/viNet/updateStatus/"+viId+"/"+status).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Update Virtual Network status)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - POST (Update Virtual Network status): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            removeVI: function (viId) {
                var promise = $http.delete("rest/viNet/removeByName/"+viId).then(function (response) {
                    var his = new HistoryService();
                    his.content = response.status+" - REMOVE (Remove Virtual Network)";
                    his.type = "INFO";
                    his.$save();
                    return response.data;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - REMOVE (Remove VI): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            }
        };
    }]);
