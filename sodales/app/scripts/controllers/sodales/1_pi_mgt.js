'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, arnService, cpeService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();
        $scope.listNetworks = [];

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');

                console.log($scope.listNetworks.length);
                $scope.listNetworks = data;
                if ($scope.listNetworks.length === 1) {
                    $rootScope.networkId = '';
                    localStorageService.set('networkId', '');
                }
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            //mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IResourceModelReader/resourceModel  
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                // $scope.generateNodeData(data.resource.resources.resource);
            });
        };

        $scope.setNetworkId = function (netId) {
            console.log('Select networkId to rootScope: ' + netId);
            $rootScope.networkId = netId;
            localStorageService.set('networkId', netId);
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
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
        };

        var getMqNaaSResource = function (root, url) {
            console.log('GET MQNAAS RESOURCE. SET RESOURCES ' + root);
            if (root === undefined) return;
            var url = generateUrl('IRootResourceAdministration', root, 'IRootResourceProvider');
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

                $scope.generateNodeData(data.IRootResource.IRootResourceId);

                localStorageService.set('networkElements', data);
                console.log('Get and store ports');

            }, function (error) {
                console.log('ERROR');
                console.log('handle error');
                console.log(error);
            });
        };

        $scope.getRealPorts = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                console.log((result.IResource.IResourceId));
                if (result.IResource.IResourceId === undefined) return;
                var ports = [];
                result.IResource.IResourceId.forEach(function (entry) {
                    var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement/' + entry + '/IAttributeStore/attribute/?arg0=portInternalId';
                    MqNaaSResourceService.getText(url).then(function (realPort) {
                        console.log('GET physical port');
                        console.log(realPort);
                        console.log(entry);
                        var p = entry + '(' + realPort + ')';
                        if (realPort > 99) ports.push({
                            '_id': p
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

                console.log('Set ports');
                console.log(localStorageService.get(resourceName));
            });
        };

        $scope.addResource = function (data) {
            console.log(data);
            if (data.type === 'arn') var resource = getResource('ARN', data.endpoint + '/cgi-bin/xml-parser.cgi');
            else if (data.type === 'cpe') var resource = getResource('CPE', data.endpoint);
            console.log(resource);
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration');
            //arnService.setUrl(data.endpoint);
            MqNaaSResourceService.put(url, resource).then(function (res) {
                console.log(res);
                $scope.dataARN = res;
                //$scope.configurePhysicalResource(data);
                //createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                $scope.nodes.add({
                    id: $scope.nodes.length,
                    label: res,
                    image: 'images/SODALES_' + data.type.toUpperCase() + '.png',
                    shape: 'image',
                    x: 50,
                    y: 50,
                    group: 'physical'
                });
            });
            this.$hide();
        };

        $scope.createLink = function () {
            console.log("Creating link");
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement";
            MqNaaSResourceService.put(url).then(function (data) {
                $scope.createdLink = data;
                $scope.createdLinkInfo = [{
                    s: $scope.source,
                    t: $scope.dest
                }];
                localStorageService.set("link", [{
                    s: $scope.source,
                    t: $scope.dest
                }]);
                return data;
            });
        };

        $scope.createPort = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.put(url).then(function (data) {});
        };

        $scope.mappingPortsToLink = function (res1, port1, portInternalId, portEth) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + res1 + "/IPortManagement/" + port1 + "/IAttributeStore/attribute/?arg0=" + portInternalId + "&arg1=" + portEth;
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.mappedPort = "Mapped";
                $scope.mappedPorts.push({
                    virt: virtualPort,
                    real: realPort
                });
            });
        };

        $scope.attachPortsToLink = function (linkId, type, portId) {
            var url;
            if (type === "source") {
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/srcPort?arg0=" + portId;
                $scope.srcPortAttahed = "Source port Attached";
            } else if (type === "dest") {
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/destPort?arg0=" + portId;
                $scope.dstPortAttahed = "Source port Attached";
            }
            MqNaaSResourceService.put(url).then(function (response) {}); //empty

        };

    });
