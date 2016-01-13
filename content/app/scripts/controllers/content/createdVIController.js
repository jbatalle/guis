'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('createdVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, ngTableParams, viService, localStorageService, $interval) {
        $rootScope.viewName = 'Created Virtual Infrastructures';
        $rootScope.networkId = "Network-2";
        var promise;
        $scope.data = [];
        $scope.updateSpList = function () {
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                //                $scope.data = result.IRootResource.IRootResourceId;
                // $scope.data = result;
                $scope.tableParams.reload();
            });
        };
        $scope.updateSpList();
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 10, // count per page
            sorting: {
                date: 'desc' // initial sorting
            }
        }, {
            total: $scope.data.length,
            getData: function ($defer, params) {
                var data = checkIfIsArray($scope.data);
                var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
    });
