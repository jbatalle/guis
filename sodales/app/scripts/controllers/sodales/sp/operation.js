'use strict';

angular.module('mqnaasApp')
    .controller('spVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, localStorageService, $modal, arnService) {
        console.log("Edit VI : " + $stateParams.id);
        $rootScope.virtNetId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.virtualResources = [];

        $scope.operation = false;
        $rootScope.virtualResource = null;

        //hardcoded
        $rootScope.networkId = "Network-Internal-1.0-2";
        $rootScope.virtNetId = "Network-virtual-7";

        $scope.getNetworkResources = function () {
            console.log("NETWORK GET RESOURCE");
            console.log($rootScope.virtNetId);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                var netEls = checkIfIsArray(result.IRootResource.IRootResourceId);
                localStorageService.set("virtualElements", netEls);
                $scope.networkRes = result.IRootResource.IRootResourceId;

                netEls.forEach(function (element) {
                    // $scope.getRealPorts(element);
                });
            });
        };

        $scope.getNetworkResources();
        $scope.createOperation = function () {
            $modal({
                template: 'partials/sodales/sp/arnOpDialog.html',
                scope: $scope
            });
        };

        $scope.openOperationARNDialog = function (resourceName, type) {
            $scope.operation = true;
            console.log("Dialog call");
            $scope.virtualResourceOp = resourceName;
            $scope.arn = new Object;

            //getLAGList
            arnService.put(getCardInterfaces(0)).then(function (response) {
                console.log(response);
                $scope.LAGs = response.response.operation.interfaceList.interface;
            });

            //getNetworkService

            /*
                        $modal({
                            template: 'views/sodales/sp/arnOpDialog.html',
                            scope: $scope
                        });*/
        };

        $scope.createLAG = function (cardId, interfaceId, lagIfIndex, ethIfIndex, description) {
            arnService.put(createLAG(cardId, interfaceId, lagIfIndex, ethIfIndex, description)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.activeLAG = function (interfaceId) {
            arnService.put(activeLAG(interfaceId)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.createNetworkService = function (id, admin, name, uplinkVlanId, uniVlanId) {
            arnService.put(createNetworkService(id, admin, name, uplinkVlanId, uniVlanId)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.openModal = function (mode) {
            var template;
            if (mode === 'createLAG') template = 'views/sodales/operation/createLAG.html';
            if (mode === 'createNS') template = 'views/sodales/operation/createNS.html';
            if (mode === 'createCS') template = 'views/sodales/operation/createCS.html';

            $modal({
                template: template,
                scope: $scope
            });
        }

        $scope.openOperationCPEDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.cpe = new Object;
            $modal({
                template: 'partials/sodales/sp/cpeOpDialog.html',
                scope: $scope
            });
        };

        $scope.Configure = function (type, form) {
            console.log(type);
            if (type === "arn") {
                console.log(form);
                var arn = form;
                var data = getARNVlanConnectivity(arn.upLinkIfaces1, arn.upLinkIfaces2, arn.downLinkIfaces1, arn.downLinkIfaces2, arn.upLinkVlan, arn.downLinkVlan);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});

            } else if (type === "cpe") {
                console.log(form);
                var cpe = form;
                var data = getCPEVlanConnectivity(cpe.egressPortId, cpe.egressVlan, cpe.ingressPortId, cpe.ingressVlan, cpe.unitId);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});
            }
            $rootScope.info = "200 - Operation done";
            this.$hide();
        };

    });
