'use strict';

services.factory('MqNaaSResourceService', function ($http, x2js, HistoryService, MQNAAS) {
    return {
        list: function (url) {
            var promise = $http.get('rest/mqnaas/' + url + '/', {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET List (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        put: function (url, data) {
            var finalUrl;
            if (url.match(/\?./)) finalUrl = 'rest/mqnaas/' + url;
            else finalUrl = 'rest/mqnaas/' + url + '/';
            var promise = $http.put(finalUrl, data, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (" + url + "): " + response.data;
                his.type = "INFO";
                his.$save();
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        get: function (url) {
            var promise = $http.get(genericUrl + url, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        getText: function (url) {
            var promise = $http.get(genericUrl + url, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (" + url + "): " + response.statusText;
                his.type = "INFO";
                his.$save();
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        remove: function (url) {
            var promise = $http.delete(genericUrl + url, {
                headers: {
                    "X-host": MQNAAS
                }
            }).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - DELETE (IRootResourceAdministration): " + response.data;
                his.type = "INFO";
                his.$save();
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - DELETE (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/xml';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/xml';
    $httpProvider.defaults.timeout = 5000;
});
