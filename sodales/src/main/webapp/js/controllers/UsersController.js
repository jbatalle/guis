'use strict';

angular.module('openNaaSApp')
        .controller('UsersController', function ($scope, $resource) {

            var Users = $resource('/rest/user/');


            $scope.users = Users.query();

            $scope.addUser = function () {

                Users.save({name: $scope.name, lastName: $scope.lastName});
                $scope.users = Users.query();
                $scope.name = $scope.lastName = '';
            };

        });