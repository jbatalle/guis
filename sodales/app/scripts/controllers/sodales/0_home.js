'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, $rootScope, HistoryService, spService, viService, MqNaaSResourceService, $modal, $alert) {

        //heartbeat mqnaas
        var urlListVI = 'IRootResourceProvider';
        MqNaaSResourceService.list(urlListVI).then(function (result) {
            console.log(result);
            if (result === undefined) {
                $scope.alert.title = "Opennaas is offline!";
                $scope.alert.content = "No connection with the machine.";
                $scope.alert.type = 'danger';
                myAlert.show();
            }
        }, function (error) {
            myAlert.show();
            console.log("test")
            console.log(error);
        });

        $scope.alert = {
            title: 'Opennaas is offline!',
            content: 'No connection with the machine.',
            type: 'danger'
        };

        // Service usage
        var myAlert = $alert({
            title: $scope.alert.title,
            content: $scope.alert.content,
            placement: 'top',
            type: $scope.alert.type,
            keyboard: true,
            show: false,
            container: '#alerts-container'
        });


        spService.getList().then(function (data) {
            if (data) $scope.spSize = data.length;
            else $scope.spSize = 0;
        });

        if ($rootScope.networkId === undefined) $scope.viSize = 0;
        else {
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                if (result === undefined) $scope.viSize = 0;
                else {
                    var data = checkIfIsArray(result.IResource.IResourceId);
                    $scope.viSize = data.length;
                }
            });
        }

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
