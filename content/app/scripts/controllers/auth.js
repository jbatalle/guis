'use strict';

angular.module('mqnaasApp')
    .controller('AuthCtrl', function ($rootScope, $scope, $location, AuthService, $window) {

        $scope.register = function () {
            var username = $scope.username;
            var password = $scope.password;
            var re_password = $scope.re_password;
            var tenant = $scope.tenant;
            var email = $scope.email;
            var fullname = $scope.fullname;

            $scope.registerForm.usernameError = false;
            $scope.registerForm.emailError = false;
            $scope.registerForm.fullnameError = false;
            //$scope.registerForm.orgError = false;
            $scope.registerForm.passError = false;
            $scope.registerForm.repassError = false;


            if (username && email && password && re_password) {
                if (password === re_password) {
                    AuthService.register(username, password, email, fullname, tenant).then(
                        function () {
                            $location.path('/login');
                        },
                        function (error) {
                            $scope.registerError = error;
                        }
                    );
                } else {
                    $scope.registerForm.repassError = true;
                    $scope.registerError = 'The repeat password is different from password.';
                }
            } else {
                if (!username) $scope.registerForm.usernameError = true;
                if (!email) $scope.registerForm.emailError = true;
                if (!password) $scope.registerForm.passError = true;
                if (!re_password) $scope.registerForm.repassError = true;
                //if(!fullname) $scope.registerForm.fullnameError = true;
                //if(!org) $scope.registerForm.usernameError = true;
                $scope.registerError = 'Username, email and password required.';
            }
        };

        $scope.loginProcess = function (username, password, ip) {
            AuthService.login(username, password, ip).then(function (data) {
                    $window.localStorage.token = data.token;
                    $window.localStorage.expiration = parseInt(data.expiration);
                    $window.localStorage.userId = data.userId;
                    $window.localStorage.username = username;
                    AuthService.profile($window.localStorage.userId).then(function (data) {
                        $window.localStorage.setItem('testObject', JSON.stringify(data));
                        $window.localStorage.user = JSON.stringify(data);
                        $window.localStorage.userRoles = [];
                        $window.localStorage.userImg = '';
                        for (var i in data.roles) {
                            $window.localStorage.userRoles += data.roles[i].name + ' ';
                            if (data.roles[i].name === 'sp') $window.localStorage.userImg = 'images/' + data.roles[i].name + '.png';
                            if (data.roles[i].name === 'ip') $window.localStorage.userImg = 'images/' + data.roles[i].name + '.png';
                            $rootScope.user_img = $window.localStorage.userImg;
                            //$window.localStorage.userRoles[i] = data.roles[i].name
                            //console.log($window.localStorage.userRoles[i]);
                        }

                        $rootScope.user = JSON.parse($window.localStorage.user);
                        $scope.loginError = '';
                        $location.path('/dashboard');
                    }, function (error) {
                        $scope.loginError = 'Login failed';
                    });
                },
                function (error) {
                    $rootScope.loginError = 'Error with the Authentication module.';
                    //$rootScope.loginError = error;
                }
            );
        };

        $scope.login = function () {
            var username = $scope.username;
            var password = $scope.password;
            $rootScope.username = username;
            if (username && password) {
                $scope.loginProcess(username, password, "");
            } else {
                $scope.loginError = 'Username and password required';
            }
        };
    });
