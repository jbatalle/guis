'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, arnService, cpeService) {
        var url = "";

        if (localStorageService.get("networkId")) $rootScope.netId = localStorageService.get("networkId");
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log("UpdateList nts");
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set("networkId", data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log("Clean localStorage networkElements due network is not created.");
                localStorageService.set("networkElements", []);
                localStorageService.set("link", []);
                console.log($rootScope.networkId);
                getMqNaaSResource($rootScope.networkId);

            });
        };

        $scope.updateListNetworks();

        $scope.setNetworkId = function (netId) {
            console.log("Select networkId to rootScope: " + netId);
            $rootScope.networkId = netId;
            localStorageService.set("networkId", netId);
            getMqNaaSResource($rootScope.networkId);
        };

        $scope.createNetwork = function () {
            var xml = getNETWORK();
            RootResourceService.put(xml).then(function (data) {
                $rootScope.networkId = data;
                //$scope.list();
                $scope.updateListNetworks();
            });
        };
        $scope.deleteResource = function (resName) {
            url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration/" + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
        };

        var getMqNaaSResource = function (root, url) {
            console.log("GET MQNAAS RESOURCE. SET RESOURCES " + root);
            if (root === undefined) return;
            var url = generateUrl("IRootResourceAdministration", root, "IRootResourceProvider");
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                if (data === undefined) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.networkElements = data;
                if (data.length > 0) {
                    data.forEach(function (resource) {
                        $scope.getRealPorts(resource);
                    });
                }

                localStorageService.set("networkElements", data);
                console.log("GEt and store ports");

            }, function (error) {
                console.log("ERROR");
                console.log("handle error");
                console.log(error);
            });
        };

        $scope.getRealPorts = function (resourceName) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                console.log(result.IResource.IResourceId);
                var ports = [];
                result.IResource.IResourceId.forEach(function (entry) {
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement/" + entry + "/IAttributeStore/attribute/?arg0=portInternalId";
                    MqNaaSResourceService.getText(url).then(function (realPort) {
                        console.log("GET physical port");
                        console.log(realPort);
                        console.log(entry);
                        var p = entry + "(" + realPort + ")";
                        if (realPort > 99) ports.push({
                            "_id": p
                        });
                        console.log(ports);
                        localStorageService.set(resourceName, {
                            name: resourceName,
                            ports: {
                                port: ports
                            }
                        });
                    });

                });

                console.log("Set ports");
                console.log(localStorageService.get(resourceName));
            });
        };

        $scope.addResource = function (data) {
            console.log(data);
            if (data.type === 'ARN') var resource = getARN(data.endpoint + "/cgi-bin/xml-parser.cgi");
            else if (data.type === 'CPE') var resource = getResource("CPE", data.endpoint);
            console.log(resource);
            url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
            arnService.setUrl(data.endpoint);
            MqNaaSResourceService.put(url, ARN).then(function (data) {
                $scope.dataARN = data;
                $scope.configurePhysicalResource(data);
                createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
            });
            this.$hide();
        };

        $scope.addCPE = function (data) {
            console.log(data);
            var CPE = getResource("CPE", data.endpoint);
            console.log(CPE);
            url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
            cpeService.setUrl(data.endpoint);
            MqNaaSResourceService.put(url, CPE).then(function (data) {
                $scope.dataCPE = data;
                $scope.configurePhysicalResource(data);
                createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
            });
            $this.close();
        };
    });
