'use strict';

angular.module('mqnaasApp')
    .controller('SodalesHomeCtrl', function ($scope, $rootScope, HistoryService, spService, $modal, $alert, IMLService) {

        var url = '';

        //heartbeat mqnaas
        var url = "phyNetworks"
        IMLService.get(url).then(function (result) {
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
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[0].id;
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
                    var url = "viNetworks";
                    IMLService.get(url).then(function (result) {
                        if (result === undefined) $scope.viSize = 0;
                        else $scope.viSize = checkIfIsArray(result).length;
                    });

                    url = "phyNetworks/" + $rootScope.networkId.id;
                    IMLService.get(url).then(function (result) {
                        if (result === undefined) $scope.resourcesSize = 0;
                        else $scope.resourcesSize = checkIfIsArray(result).length;
                    });
                }
            }
        );

        HistoryService.query({}, function (data) {
            data.reverse().splice(10, Number.MAX_VALUE);
            $scope.lastHistory = data.reverse();
        });
    });
