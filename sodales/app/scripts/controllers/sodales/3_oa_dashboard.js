'use strict';

angular.module('mqnaasApp')
    .controller('SodalesOpenaccessDashCtrl', function ($rootScope, $scope, $filter, spService, viService, $modal, viNetService, UsersService, MqNaaSResourceService) {

        $scope.listVi = [];
        $scope.data = [];
        $scope.dataCollection = [];
        $scope.collapsed = false;
        $scope.current_sp = null;
        $scope.spUsers = [];

        $scope.updateSpList = function () {

            spService.getList().then(function (data) {
                console.log("SP List update");
                $scope.data = data;
                $scope.dataCollection = data;
            });
            /*
                        viService.list().then(function (data) {
                            $scope.listVi = [];
                            if (data === undefined) return;
                            data.forEach(function (vi) {
                                console.log(vi);
                                if (vi.status === "Created")
                                    $scope.listVi.push(vi.name);
                            });
                        });*/
            var urlVirtNets = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement';
            MqNaaSResourceService.list(urlVirtNets).then(function (result) {
                if (result === undefined) return;
                $scope.networkCollection = checkIfIsArray(result.IRootResource.IRootResourceId);
                $scope.networkCollection.forEach(function (vi) {
                    console.log(vi);
                    $scope.listVi.push(vi);
                });
            });
        };

        $scope.updateSpList();
        $scope.openSPCreationDialog = function () {
            $modal({
                title: 'Create new SP.',
                template: 'views/sodales/spCreationDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.addVI = function (spName, vi) {
            console.log(spName);
            console.log(vi);
            spService.addViToSP(spName, vi).then(function (response) {
                $scope.updateSpList();
            });
        };

        $scope.removeVI = function (spName, vi) {
            console.log(vi);
            spService.removeVIOfSP(spName, vi).then(function (response) {
                $scope.updateSpList();
            });
        };

        $scope.addSP = function (data) {
            console.log("Adding SP");
            console.log(data);
            var name = data.name; //{"name":"SP4"}
            var sp = {
                "name": name.replace(/\s/g, ""),
                "url": data.url,
                "description": data.description
            };
            spService.post(sp).then(function (response) {
                console.log(response);
                $scope.updateSpList();
            });
            this.$hide();
        };

        $scope.removeSP = function (data) {
            console.log("Remove SP");
            console.log(data);
            spService.remove(data).then(function (response) {
                console.log(response);
                $scope.updateSpList();
            });
        };

        $scope.selectedSP = function (row) {
            $scope.current_sp = row;
            $scope.collapsed = true;
            spService.getUsers(row.id).then(function (data) {
                console.log(data);
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
                template: 'views/sodales/sp/addUser.html',
                show: true,
                scope: $scope,
            });
        };

        $scope.addUser = function (row) {
            console.log(row);

            spService.addUser(row.id, $scope.current_sp.id).then(function (data) {
                console.log(data);
            });
        };

        $scope.removeUser = function (user) {
            console.log(user);
            spService.delUser(user.id, user.sp_id).then(function (data) {
                console.log(data);
            });
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
