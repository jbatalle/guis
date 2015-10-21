'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHistoryController', function ($scope, HistoryService, $filter) {
        $scope.dataCollection = HistoryService.query({}, function (result) {

            console.log(result);
        });


        $scope.clearHistory = function () {
            HistoryService.remove({}, function (result) {

                console.log(result);
            });
        };
    });
