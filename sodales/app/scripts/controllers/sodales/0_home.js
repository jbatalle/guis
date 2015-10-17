'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, $rootScope, HistoryService, spService, viService, MqNaaSResourceService, $modal, $alert) {

        var url = '';

        //heartbeat mqnaas
        var url = 'IRootResourceProvider';
        MqNaaSResourceService.list(url).then(function (result) {
            console.log(result);
            if (result === undefined) {
                $rootScope.networkId = undefined;
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

        spService.getList().then(function (data) {
            if (data) $scope.spSize = data.length;
            else $scope.spSize = 0;
        });

        $scope.viSize = 0;
        $scope.resourcesSize = 0
        if ($rootScope.networkId === undefined) {
            $scope.viSize = 0;
            $scope.resourcesSize = 0;
        } else {
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(url).then(function (result) {
                console.log(result);
                if (result === undefined) $scope.viSize = 0;
                else {
                    var data = checkIfIsArray(result.IResource.IResourceId);
                    $scope.viSize = data.length;
                }
            });

            url = "http://localhost:9000/mqnaas/IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceProvider";
            MqNaaSResourceService.list(url).then(function (result) {
                console.log(result);
                if (result === undefined) $scope.resourcesSize = 0;
                else $scope.resourcesSize = checkIfIsArray(result.IRootResource.IRootResourceId).length;
            });

        }

        HistoryService.query({}, function (data) {
            data.splice(10, Number.MAX_VALUE);
            $scope.lastHistory = data;
            console.log(data);
        });
    });
