'use strict';

angular.module('openNaaSApp')
        .controller('LoginController', function ($scope, $rootScope, $location, $cookieStore, UserService) {

    $scope.rememberMe = false;

    $scope.login = function () {
        UserService.authenticate($.param({username: $scope.username, password: $scope.password}), function (authenticationResult) {
            var authToken = authenticationResult.token;
            $rootScope.authToken = authToken;
            if ($scope.rememberMe) {
                $cookieStore.put('authToken', authToken);
            }
            UserService.get(function (user) {
                $rootScope.user = user;
                console.log(user);
                if(user.name === "sp") $location.path("/spInfo");
                else $location.path("/");
            });
        });
    };
});