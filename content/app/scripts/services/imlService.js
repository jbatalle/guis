'use strict';

services.factory('IMLService', function ($http, x2js, IML) {
    return {
        get: function (url) {
            var promise = $http.get(IML + url).then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            });
            return promise;
        },
        post: function (url, data) {
            var promise = $http.post(IML + url, data).then(function (response) {
                return response.data;
            }, function (response) {
                his.$save();
            });
            return promise;
        },
        put: function (url, data) {
            var promise = $http.put(IML + url, data).then(function (response) {
                return response.data;
            }, function (response) {
                his.$save();
            });
            return promise;
        },
        delete: function (url) {
            var promise = $http.delete(IML + url).then(function (response) {}, function (response) {});
            return promise;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/xml';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/xml';
    $httpProvider.defaults.timeout = 5000;
});
