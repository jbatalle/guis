'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, $rootScope, HistoryService, spService, viService, MqNaaSResourceService) {

        spService.getList().then(function (data) {
            if (data) $scope.spSize = data.length;
            else $scope.spSize = 0;
        });

        var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
        MqNaaSResourceService.list(urlListVI).then(function (result) {
            console.log(result);
            if (result === undefined) $scope.viSize = 0;
            else {
                var data = checkIfIsArray(result.IResource.IResourceId);
                $scope.viSize = data.length;
            }
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
