'use strict';

angular.module('openNaaSApp')
        .controller('SodalesOpenaccessDashCtrl', function ($scope, $filter, ngTableParams, spService, viService, ngDialog) {

            $scope.listVi = [];

            $scope.updateSpList = function () {
                viService.list().then(function (data) {
                    $scope.listVi = [];
                    data.forEach(function (vi) {
                        console.log(vi);
                    if(vi.status === "created")
                        $scope.listVi.push(vi.name);
                    });
                    spService.list().then(function (data) {
                        $scope.data = data;
                    });
                    $scope.tableParams.reload();
                });
            };

            spService.list().then(function (data) {
                console.log(data);
                $scope.data = data;
                //$scope.spList = data;
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    sorting: {
                        date: 'desc'     // initial sorting
                    }
                }, {
                    total: data.length,
                    getData: function ($defer, params) {
                        console.log($scope.data);
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    $scope: {$data: {}}
                });
            });
            //};
            $scope.updateSpList();
            $scope.openSPCreationDialog = function () {
                ngDialog.open({template: 'partials/sodales/spCreationDialog.html'});
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
                var name = data.name;//{"name":"SP4"}
                var sp = {"name": name.replace(/\s/g, "")};
                spService.createSP(sp).then(function (response) {
                    console.log(response);
                    $scope.updateSpList();
                });
                ngDialog.close();
            };
        });