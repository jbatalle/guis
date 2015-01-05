'use strict';

angular.module('openNaaSApp')
        .controller('listVIController', function ($scope, MqNaaSResourceService, $filter, ngTableParams) {
            console.log("LIST VI");
            var urlListVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
            $scope.data = [];
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                $scope.data = result.IResource.IResourceId;
                $scope.tableParams.reload();
//                return result.IResource;
            });
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: $scope.data.length,
                getData: function ($defer, params) {
                    var data = checkIfIsArray($scope.data);
                    console.log(data);
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });

            $scope.createVIRequest = function () {
                var urlCreateVI = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement";
                MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                    $scope.data.push(result);
                    $scope.tableParams.reload();
                });
            };
        })
        .controller('editVIController', function ($scope, MqNaaSResourceService, $routeParams) {
            console.log("Edit VI : " + $routeParams.id);
            $scope.viId = $routeParams.id;

            var urlPeriod = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
            MqNaaSResourceService.get(urlPeriod).then(function (result) {
                $scope.period = result;
            });

            $scope.setPeriod = function (start, end) {
                var urlPeriod = "IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
                var period = getPeriod(949359600, 980895600);//xml
                MqNaaSResourceService.put(urlPeriod, period).then(function () {//the response is empty
                });
            };

        });
