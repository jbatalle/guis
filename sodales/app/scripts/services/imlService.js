'use strict';

services.factory('IMLService', function ($http, x2js, HistoryService, IML) {
    return {
        get: function (url) {
            var promise = $http.get(IML + url).then(function (response) {
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET List (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
                return response;
            });
            return promise;
        },
        post: function (url, data) {
            var promise = $http.post(IML + url, data).then(function (response) {
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
        put: function (url, data) {
            var promise = $http.put(IML + url, data).then(function (response) {
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (" + url + "): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        delete: function (url) {
            var promise = $http.delete(IML + url).then(function (response) {
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
