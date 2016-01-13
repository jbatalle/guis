'use strict';

services.factory('RootResourceService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
        console.log("PUT RootResource MqNaaS");
        return {
            list: function () {
                var promise = $http.get('rest/mqnaas/IRootResourceProvider').then(function (response) {
                    var json = x2js.xml_str2json(response.data);
                    return json;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - GET List (IRootResourceAdministration): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            put: function (data) {
                var promise = $http.put('rest/mqnaas/IRootResourceAdministration', data).then(function (response) {
                    console.log(response);
                    var json = response.data;
                    var his = new HistoryService();
                    his.content = response.status+" - PUT (IRootResourceAdministration): "+response.data;
                    his.type = "INFO";
                    his.$save();
                    return json;
                }, function(response){
                    var his = new HistoryService();
                    his.content = response.status+" - PUT (IRootResourceAdministration): "+response.statusText;
                    his.type = "ERROR";
                    his.$save();
                });
                return promise;
            },
            get: function (id) {
                var promise = $http.get('rest/mqnaas/IRootResourceProvider/'+id).then(function (response) {
                    var json = x2js.xml_str2json(response.data);
                    return json;
                }
                );
                return promise;
            },
            remove: function (data) {
                console.log(data);
                var promise = $http.delete('rest/mqnaas/IRootResourceAdministration/'+data).then(function (response) {
                    console.log(response);
                    var his = new HistoryService();
                    his.content = response.status+" - DELETE (IRootResourceAdministration): "+response.data;
                    his.type = "INFO";
                    his.$save();
//                    return json;
                }
                );
                return promise;
            }
        };
    }]);
