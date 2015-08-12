'use strict';

angular.module('openNaaSApp')
        .controller('SodalesHomeCtrl', function ($scope, HistoryService, spService, viService) {

            spService.list().then(function (data) {
                console.log("GET SP SIZE");
                $scope.spSize = data.length;
            });

            viService.list().then(function (data) {
                console.log("GET VI SIZE");
                $scope.viSize = data.length;
            });
            $scope.slicesSize = 0;
            /*            viService.list().then(function (data) {
             console.log("GET Slices SIZE");
             $scope.slicesSize = data.length;
             });
             */

            HistoryService.query({}, function (data) {
                data.splice(10, Number.MAX_VALUE);
                $scope.lastHistory = data;
                console.log(data);
            });
        });