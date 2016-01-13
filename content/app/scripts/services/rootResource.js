'use strict';

services.factory('RootResourceService', function ($http, x2js, HistoryService, MQNAAS) {
    return {
        list: function () {
            //var promise = $http.get('rest/mqnaas/IRootResourceProvider/?arg0=NETWORK').then(function (response) {
            var promise = $http.get('rest/mqnaas/IRootResourceProvider/', {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET List (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        put: function (data) {
            var promise = $http.put('rest/mqnaas/IRootResourceAdministration/', data, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var json = response.data;
                var his = new HistoryService();
                his.content = response.status + " - PUT (IRootResourceAdministration): " + response.data;
                his.type = "INFO";
                his.$save();
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        get: function (id) {
            var promise = $http.get('rest/mqnaas/IRootResourceProvider/' + id, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            });
            return promise;
        },
        remove: function (data) {
            var promise = $http.delete('rest/mqnaas/IRootResourceAdministration/' + data, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - DELETE (IRootResourceAdministration): " + response.data;
                his.type = "INFO";
                his.$save();
            });
            return promise;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/xml';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/xml';
});
