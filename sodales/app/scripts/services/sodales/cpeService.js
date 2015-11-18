'use strict';

services.factory('cpeService', function ($rootScope, $http, x2js, HistoryService) {
    return {
        get: function (req, host) {
            var promise = $http.get("rest/cpe/" + req, {
                headers: {
                    "X-host": $rootScope.resourceUri
                }
            }).then(function (response) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (CPE Service Statistics): " + req;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        post: function (req, data, host) {
            var promise = $http.post("rest/cpe/" + req, data, {
                headers: {
                    "X-host": $rootScope.resourceUri
                }
            }).then(function (response) {
                var x2js = new X2JS();
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - POST (CPE Service Statistics): " + req;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        setUrl: function (url) {
            var promise = $http.put("rest/cpe/setURL", url).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (Set CPE URL): ";
                his.type = "INFO";
                his.$save();
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - POST (Set CPE URL): ";
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        }
    };
});
