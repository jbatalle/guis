'use strict';

angular.module('mqnaasApp')
    .controller('operatorlistController', function ($rootScope, $scope, $filter, spService, $modal, UsersService, IMLService) {

        $rootScope.viewName = 'Operators';
        var url;
        $scope.listVi = [];
        //$scope.data = [];
        $scope.dataCollection = [];
        $scope.collapsed = false;
        $scope.current_sp = null;
        $scope.spUsers = [];

        $scope.updateSpList = function () {
            $scope.listVi = [];
            var url = "viNetworks"
            IMLService.get(url).then(function (result) {
                if (result === undefined) return;
                $scope.networkCollection = result;
                spService.getList().then(function (data) {
                    $scope.dataCollection = data;
                    var i, j;
                    if ($scope.networkCollection.length === 0) {
                        for (i = 0; i < $scope.dataCollection.length; i++) {
                            for (j = 0; j < $scope.dataCollection[i].vis.length; j++) {
                                $scope.removeVI($scope.dataCollection[i].id, $scope.dataCollection[i].vis[j].name);
                            }
                        }
                    } else {
                        for (i = 0; i < $scope.dataCollection.length; i++) {
                            for (j = 0; j < $scope.dataCollection[i].vis.length; j++) {
                                url = 'viNetworks/' + $scope.dataCollection[i].vis[j].name;
                                IMLService.get(url).then(function (result) {
                                    if (result === undefined) $scope.removeVI($scope.dataCollection[i].id, $scope.dataCollection[i].vis[j].name);
                                });
                            };
                        }
                    }
                });

                $scope.networkCollection.forEach(function (vi) {
                    $scope.listVi.push(vi);
                });
            });
            UsersService.getUsers().then(function (users) {
                $scope.usersDataCollection = users;
            });
        };

        $scope.updateSpList();

        $scope.openSPCreationDialog = function () {
            $modal({
                title: 'Create new SP.',
                template: 'views/modals/ip_oa/spCreationDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.addVI = function (spName, vi) {
            spService.addViToSP(spName, vi).then(function (response) {
                $scope.updateSpList();
            });
        };

        $scope.removeVI = function (spName, vi) {
            spService.removeVIOfSP(spName, vi).then(function (response) {
                $scope.updateSpList();
            });
        };

        $scope.addSP = function (data) {
            var name = data.name; //{"name":"SP4"}
            var sp = {
                "name": name.replace(/\s/g, ""),
                "url": data.url,
                "description": data.description
            };
            spService.post(sp).then(function (response) {
                $scope.updateSpList();
            });
            this.$hide();
        };

        $scope.removeSP = function (data) {
            spService.remove(data).then(function (response) {
                $scope.updateSpList();
            });
        };

        $scope.selectedSP = function (row) {
            $scope.current_sp = row;
            $scope.collapsed = true;
            spService.getUsers(row.id).then(function (data) {
                $scope.dataCollection2 = data;
            });
        };

        $scope.addUserDialog = function (row) {
            UsersService.getUsers().then(function (data) {
                $scope.users = data;
            });
            spService.getUsers(row.id).then(function (data) {
                $scope.spUsers = data;
            });
            $modal({
                title: 'Adding user to SP ' + row.name + '.',
                template: 'views/modals/ip_oa/addUser.html',
                show: true,
                scope: $scope,
            });
        };

        $scope.addUser = function (row) {
            spService.addUser(row.id, $scope.current_sp.id).then(function (data) {
                spService.getUsers(row.id).then(function (data) {
                    $scope.spUsers = data;
                });
            });
        };

        $scope.removeUser = function (user) {
            spService.removeUser(user.id, user.sp_id).then(function (data) {});
        };

        $scope.deleteUser = function () {
            UsersService.remove(user.id).then(function (data) {});
        };

        $scope.createUserDialog = function () {
            $modal({
                title: 'Creating user',
                template: 'views/modals/ip_oa/modalUserCreation.html',
                show: true,
                scope: $scope,
            });
        };

        $scope.createUser = function (user) {
            if (user.password !== user.re_password) return;
            UsersService.register(user.username, user.password, user.email, user.fullname).then(function (result) {
                console.log(result)
                    // this.$hide();
            });
            this.$hide();
        };

        $scope.activeUser = function (user) {
            UsersService.activeUser(user.id).then(function () {
                $scope.updateSpList();
            })
        };

    }).filter('exclude', function () {
        return function (items, exclude) {
            if (exclude === []) return;
            if (items === undefined) return;
            if (items === 0) return;
            if (items instanceof Array) {} else {
                return;
            }
            return items.filter(function (item) {
                return exclude.indexOf(item) === -1;
            });
        };
    }).filter('excludeByName', function () {
        return function (items, exclude) {
            if (exclude === []) return;
            if (items === undefined) return;
            if (items === 0) return;
            if (items instanceof Array) {} else {
                return;
            }
            return items.filter(function (item) {
                return exclude.indexOf(item.name) === -1;
            });
        };
    });
