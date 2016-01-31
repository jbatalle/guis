'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHistoryController', function ($scope, HistoryService, $filter) {

        $scope.listHistory = function () {
            HistoryService.query({}, function (result) {
                $scope.dataCollection = result.reverse();
            });
        };
        $scope.listHistory();

        $scope.clearHistory = function () {
            HistoryService.remove({}, function (result) {
                $scope.listHistory();
            });
        };
    });
