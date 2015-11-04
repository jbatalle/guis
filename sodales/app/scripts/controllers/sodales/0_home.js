'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, $rootScope, HistoryService, spService, viService, MqNaaSResourceService, $modal, $alert, RootResourceService) {

        var url = '';

        //heartbeat mqnaas
        var url = 'IRootResourceProvider';
        MqNaaSResourceService.list(url).then(function (result) {
            if (result === undefined) {
                $rootScope.networkId = undefined;
                $scope.alert.title = "Opennaas is offline!";
                $scope.alert.content = "No connection with the machine.";
                $scope.alert.type = 'danger';
                myAlert.show();
            }
        }, function (error) {
            myAlert.show();
        });

        $scope.alert = {
            title: 'Opennaas is offline!',
            content: 'No connection with the machine.',
            type: 'danger'
        };

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                }
            });
        };

        $scope.updateListNetworks();

        spService.getList().then(function (data) {
            if (data) $scope.spSize = data.length;
            else $scope.spSize = 0;
        });

        $scope.viSize = 0;
        $scope.resourcesSize = 0;

        $scope.$watch(function (rootScope) {
                return rootScope.networkId
            },
            function (newValue, oldValue) {
                if ($rootScope.networkId === undefined) {
                    $scope.viSize = 0;
                    $scope.resourcesSize = 0;
                } else {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
                    MqNaaSResourceService.list(url).then(function (result) {
                        if (result === undefined) $scope.viSize = 0;
                        else $scope.viSize = checkIfIsArray(result.IResource.IResourceId).length;
                    });

                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceProvider";
                    MqNaaSResourceService.list(url).then(function (result) {
                        if (result === undefined) $scope.resourcesSize = 0;
                        else $scope.resourcesSize = checkIfIsArray(result.IRootResource.IRootResourceId).length;
                    });
                }
            }
        );

        HistoryService.query({}, function (data) {
            data.reverse().splice(10, Number.MAX_VALUE);
            $scope.lastHistory = data.reverse();
        });
    });
