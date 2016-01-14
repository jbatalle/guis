'use strict';

services.factory('NitosService', function ($http) {
    return {
        get: function (url) {
            var promise = $http.get("/rest/nitos/" + url).then(function (response) {
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
