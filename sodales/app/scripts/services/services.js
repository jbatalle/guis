'use strict';

angular.module('mqnaasApp')
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    })
    .factory('ServicesService', function ($http, $window, $q, BACKEND) {

        var getList = function (tenant_id) {
            var url = BACKEND + 'system/tenants/' + tenant_id + '/svc/definitions';
            var deferred = $q.defer();

            var promise = $http.get(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var getFvds = function (tenant_id, object_id) {
            var url = BACKEND + 'system/tenants/' + tenant_id + '/svc/definitions/' + object_id + '/fvd/definitions';
            var deferred = $q.defer();

            var promise = $http.get(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var get = function (object_id) {
            var url = BACKEND + 'service/' + object_id;
            var deferred = $q.defer();

            var promise = $http.get(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var post = function (object) {
            var url = BACKEND + 'service';
            var deferred = $q.defer();
            var promise = $http.post(url, object)
                .then(function (response) {
                        return response.data;
                    },
                    function (response) {
                        deferred.reject(response.data);
                    }
                );
            return promise;
        };

        var deploy = function (object_id, object) {
            var url = BACKEND + 'service/instance';
            var deferred = $q.defer();
            console.log(object_id);
            console.log(object);
            var promise = $http.post(url, object).then(function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var remove = function (object_id) {
            var url = BACKEND + 'service/' + object_id;
            var deferred = $q.defer();

            var promise = $http.delete(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        return {
            getList: function (tenant_id) {
                return getList(tenant_id);
            },
            getFvds: function (tenant_id, object_id) {
                return getFvds(tenant_id, object_id);
            },
            get: function (object_id) {
                return get(object_id);
            },
            post: function (object) {
                return post(object);
            },
            deploy: function (object_id, object) {
                return deploy(object_id, object);
            },
            delete: function (object_id) {
                return remove(object_id);
            }
        };
    });
