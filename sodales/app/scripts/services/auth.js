'use strict';

angular.module('mqnaasApp')
    .factory('AuthService', function ($http, $window, $q, AUTHENTICATION) {

        var getIP = function () {
            var url = 'http://www.telize.com/jsonip';
            var deferred = $q.defer();

            $http.get(url).then(
                function (response) {
                    console.log(response);
                    deferred.resolve(response.data);
                },
                function (response) {
                    console.log(response);
                    deferred.resolve('null');
                }
            );
            return deferred.promise;
        };

        var authenticate_register = function (username, password, email, fullname, tenant, endpoint) {
            var url = AUTHENTICATION + endpoint;
            var deferred = $q.defer();

            $http.post(url, 'username=' + username + '&password=' + password + '&email=' + email + '&fullname=' + fullname + '&tenant=' + tenant, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function (response) {
                    console.log(response);
                    deferred.resolve(true);
                },
                function (response) {
                    console.log(response);
                    deferred.reject(response.data);
                }
            );
            return deferred.promise;
        };

        var authenticate = function (username, password, endpoint, ip) {
            var url = AUTHENTICATION + endpoint;
            var deferred = $q.defer();

            $http.post(url, 'username=' + username + '&password=' + password, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Client-IP': ip
                }
            }).then(
                function (response) {
                    if (endpoint === 'login') {
                        var token = response.data.token;
                        var userId = response.data.user_id;
                        if (token && username) {
                            $window.localStorage.token = token;
                            $window.localStorage.userId = userId;
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject('Invalid data received from server');
                        }
                    }
                },
                function (response) {
                    console.log(response);
                    deferred.reject(response.data);

                }
            );
            return deferred.promise;
        };

        var logout = function (userId) {
            var deferred = $q.defer();
            var url = AUTHENTICATION + 'logout';
            $http.post(url, 'user_id=' + userId, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function (response) {
                    $window.localStorage.removeItem('token');
                    $window.localStorage.removeItem('username');
                    console.log(response);
                    deferred.resolve(response.data);
                },
                function (response) {
                    console.log(response);
                    deferred.resolve(response.data);
                }
            );
            return deferred.promise;
        };

        var profile = function () {
            var deferred = $q.defer();
            var url = AUTHENTICATION + 'profile';
            $http.get(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (error) {
                    deferred.reject(error.data.error);
                }
            );
            return deferred.promise;
        };

        return {
            getIP: function () {
                return getIP();
            },
            register: function (username, password, email, fullname, tenant) {
                return authenticate_register(username, password, email, fullname, tenant, 'register');
            },
            login: function (username, password, ip) {
                return authenticate(username, password, 'login', ip);
            },
            logout: function (userId) {
                return logout(userId);
            },
            profile: function () {
                return profile();
            }
        };

    });
