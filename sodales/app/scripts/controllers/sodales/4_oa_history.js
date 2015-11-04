'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHistoryController', function ($scope, HistoryService, $filter) {
        HistoryService.query({}, function (result) {
            $scope.dataCollection = result.reverse();
        });

        $scope.clearHistory = function () {
            HistoryService.remove({}, function (result) {});
        };
    });
