'use strict';

angular.module('mqnaasApp')
    .factory('spService', function ($http, $window, $q, AUTHENTICATION) {

        var getList = function () {
            var url = AUTHENTICATION + 'sp';
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
            var url = AUTHENTICATION + 'sp/' + object_id;
            var deferred = $q.defer();

            var promise = $http.get(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                    deferred.reject(response.data.error);
                }
            );
            return promise;
        };

        var post = function (object) {
            var url = AUTHENTICATION + 'sp';
            var deferred = $q.defer();

            var promise = $http.post(url, object).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var addViToSP = function (id, viId) {
            var url = AUTHENTICATION + 'sp/' + id + '/vi/' + viId;
            var deferred = $q.defer();

            var promise = $http.post(url, {}).then(
                function (response) {
                    return response.data;
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
        };

        var removeVIOfSP = function (id, viId) {
            var url = AUTHENTICATION + 'sp/' + id + '/vi/' + viId;
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

        var getByName = function (id) {
            var url = AUTHENTICATION + 'sp/getSPByName/' + id;
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

        var remove = function (id) {
            var url = AUTHENTICATION + 'sp/' + id;
            var deferred = $q.defer();

            var promise = $http.delete(url).then(
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
            getList: function () {
                return getList();
            },
            get: function (object_id) {
                return get(object_id);
            },
            post: function (object) {
                return post(object);
            },
            addViToSP: function (object_id, viId) {
                return addViToSP(object_id, viId);
            },
            removeVIOfSP: function (id, viId) {
                return removeVIOfSP(id, viId);
            },
            getByName: function (id) {
                return getByName(id);
            },
            remove: function (id) {
                return remove(id);
            }
        };

    });
