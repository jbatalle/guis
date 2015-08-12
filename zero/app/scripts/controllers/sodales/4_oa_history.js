'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHistoryController', function ($scope, HistoryService, $filter) {
        $scope.dataCollection = HistoryService.query({}, function () {
            $scope.tableParams.reload();
            $scope.dataCollection = result;
        });
    });
