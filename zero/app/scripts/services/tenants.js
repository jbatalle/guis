'use strict';

angular.module('mqnaasApp')
    .factory('TenantsService', function ($http, $window, $q, AUTHENTICATION) {

        var getList = function () {
            var url = AUTHENTICATION + 'tenants';
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

        var getListEnabled = function () {
            var url = AUTHENTICATION + 'tenants/enabled';
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


        var activeTenant = function (id) {
            var url = AUTHENTICATION + 'tenants/' + id + '/activate';
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

        var disableTenant = function (id) {
            var url = AUTHENTICATION + 'tenants/' + id + '/disable';
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


        var getUserList = function (object_id) {
            var url = AUTHENTICATION + 'tenants/' + object_id + '/users';
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

        //to remove....
        /*var getUserList2 = function () {
            var url = AUTHENTICATION + 'tenants/users';
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
        };*/

        var get = function (object_id) {
            var url = AUTHENTICATION + 'tenants/' + object_id;
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
            var url = AUTHENTICATION + 'tenants';
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
            var url = AUTHENTICATION + 'tenants/' + id;
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
            getUsers: function (object_id) {
                return getUserList(object_id);
            },
            remove: function (id) {
                return remove(id);
            },            
            activeTenant: function (id) {
                return activeTenant(id);
            },
            disableTenant: function (id) {
                return disableTenant(id);
            },
            getListEnabled: function() { 
                return getListEnabled();
            }

        };

    });
