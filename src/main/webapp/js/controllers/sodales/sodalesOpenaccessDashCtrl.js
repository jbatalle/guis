'use strict';

angular.module('openNaaSApp')
        .controller('SodalesOpenaccessDashCtrl', function ($scope, $filter, ngTableParams, spService, ngDialog) {

//$scope.listVi = [{name:"vi-1"},{name:"vi-2"},{name:"vi-4"}];
$scope.listVi = ["vi-1","vi-2","vi-4"];
            spService.list().then(function (data) {
                console.log(data);
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
                        console.log(data);
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    $scope: {$data: {}}
                });
            });

            $scope.openSPCreationDialog = function () {
                ngDialog.open({template: 'partials/sodales/spCreationDialog.html'});
            };
            
            $scope.addVI = function (spName, vi) {
                console.log(spName);
                console.log(vi);
                spService.addViToSP(spName, vi).then(function (response) {
                    
                });

            };
            
            $scope.removeVI = function (spName, vi) {
                console.log(spName);
                console.log(vi);
                spService.removeVIOfSP(spName, vi).then(function (response) {
                    
                });

            };
            
            $scope.addSP = function (data) {
                console.log("Adding SP");
                console.log(data);
                var name = data.name;//{"name":"SP4"}
                var sp = {"name": name.replace( /\s/g, "")};
                console.log(sp);
                spService.createSP(sp).then(function (response) {
                    console.log(response);
                });
                ngDialog.close();
            };
        });