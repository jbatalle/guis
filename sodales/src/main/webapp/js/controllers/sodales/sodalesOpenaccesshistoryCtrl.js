'use strict';

angular.module('openNaaSApp')
        .controller('SodalesHistoryController', function ($scope, HistoryService, $filter, ngTableParams) {
            var data = HistoryService.query({}, function () {
                $scope.tableParams.reload();
            });

            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: data.length,
                getData: function ($defer, params) {
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });
        });