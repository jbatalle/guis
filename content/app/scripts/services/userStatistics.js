'use strict';

angular.module('mqnaasApp')
    .factory('UserStatisticsService', function ($http, $window, $q, AUTHENTICATION) {

        var getList = function () {
            var url = AUTHENTICATION + 'statistic';
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
            var url = AUTHENTICATION + 'statistic/' + object_id;
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

        var getLastLogins = function (user_id) {
            var url = AUTHENTICATION + 'lastlogins/' + user_id;
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
            var url = AUTHENTICATION + 'statistic';
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

        var remove = function (id) {
            var url = AUTHENTICATION + 'statistic/' + id;
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
            getLastLogins: function (user_id) {
                return getLastLogins(user_id);
            },
            post: function (object) {
                return post(object);
            },
            remove: function (id) {
                return remove(id);
            }
        };

    });