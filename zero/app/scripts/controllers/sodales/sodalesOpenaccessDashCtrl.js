'use strict';

angular.module('mqnaasApp')
    .controller('SodalesOpenaccessDashCtrl', function ($scope, $filter, spService, viService, $modal, viNetService) {

        $scope.listVi = [];
        $scope.data = [];
        $scope.dataCollection = [];

        $scope.updateSpList = function () {
            viNetService.list().then(function (data) {
                $scope.listVi = [];
                data.forEach(function (vi) {
                    console.log(vi);
                    if (vi.status === "Created")
                        $scope.listVi.push(vi.name);
                });
                spService.list().then(function (data) {
                    console.log("SP List update");
                    $scope.data = data;
                    $scope.dataCollection = data;
                    $scope.tableParams.reload();
                });

            });
        };

        $scope.updateSpList();
        $scope.openSPCreationDialog = function () {
            $modal({
                title: 'Create new SP.',
                template: 'views/sodales/spCreationDialog.html',
                show: true,
                scope: $scope,
            });
        };

        $scope.addVI = function (spName, vi) {
            console.log(spName);
            console.log(vi);
            spService.addViToSP(spName, vi).then(function (response) {
                $scope.updateSpList();
                $scope.tableParams.reload();
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
                "name": name.replace(/\s/g, "")
            };
            spService.createSP(sp).then(function (response) {
                console.log(response);
                $scope.updateSpList();
                $scope.tableParams.reload();
            });
            this.$hide();
        };
        $scope.removeSP = function (data) {
            console.log("Remove SP");
            console.log(data);
            spService.removeSP(data).then(function (response) {
                console.log(response);
                $scope.updateSpList();
            });
        };
    });
