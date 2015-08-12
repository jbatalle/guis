'use strict';

services.factory('MqNaaSResourceService', ['$http', 'x2js', 'HistoryService', function ($http, x2js, HistoryService) {
    console.log("MqNaaS Resource Service");
    return {
        list: function (url) {
            var promise = $http.get('rest/mqnaas/' + url + '/').then(function (response) {
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
        put: function (url, data) {
            var promise = $http.put('rest/mqnaas/' + url + '/', data).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (IRootResourceAdministration): " + response.data;
                his.type = "INFO";
                his.$save();
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - PUT (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        get: function (url) {
            var promise = $http.get(genericUrl + url).then(function (response) {
                var json = x2js.xml_str2json(response.data);
                return json;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        getText: function (url) {
            var promise = $http.get(genericUrl + url).then(function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (IRootResourceAdministration): " + response.statusText;
                his.type = "INFO";
                his.$save();
                return response.data;
            }, function (response) {
                var his = new HistoryService();
                his.content = response.status + " - GET (IRootResourceAdministration): " + response.statusText;
                his.type = "ERROR";
                his.$save();
            });
            return promise;
        },
        remove: function (url) {
            console.log(url);
            var promise = $http.delete(genericUrl + url).then(function (response) {
                // convert the data to JSON and provide
                // it to the success function below
                //var x2js = new X2JS();
                console.log(response);
                //                    var json = x2js.xml_str2json(response.data);
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
    }]).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/xml';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/xml';
});