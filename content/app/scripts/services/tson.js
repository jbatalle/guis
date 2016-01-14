'use strict';

services.factory('TsonService', function ($http, x2js) {
    return {
        get: function (url) {
            var promise = $http.get("/rest/tson/TSONAGENT/Agent0webresources/Call", {
                headers: {
                    "X-host": url
                }
            }).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                return response;
            });
            return promise;
        },
        post: function (url, data) {
            var promise = $http.post("/rest/tson/" + url, data).then(function (response) {
                return response.data;
            }, function (response) {
                return response;
            });
            return promise;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/xml';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/xml';
    $httpProvider.defaults.timeout = 5000;
});
