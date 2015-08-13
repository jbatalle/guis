'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, HistoryService, spService, viService) {

        spService.getList().then(function (data) {
            if (data) $scope.spSize = data.length;
            else $scope.spSize = 0;
        });

        viService.list().then(function (data) {
            if (data) $scope.viSize = data.length;
            else $scope.viSize = 0;
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
