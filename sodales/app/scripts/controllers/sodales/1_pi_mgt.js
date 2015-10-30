'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $window, $modal, RootResourceService, arnService, cpeService, $alert, $interval) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();
        $scope.listNetworks = [];

        if ($window.localStorage.networkId) $rootScope.netId = $window.localStorage.networkId;
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
                console.log(data);

                console.log($scope.listNetworks.length);
                $scope.listNetworks = data;
                if ($scope.listNetworks.length === 1) {
                    $rootScope.networkId = '';
                    $window.localStorage.networkId = '';
                }
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    $window.localStorage.networkId = data[1];
                }
                $scope.selectedNetwork = $rootScope.networkId;
                //                getMqNaaSResource($rootScope.networkId);
                // $scope.getNetworkModel();
                $scope.updateResourceList();
            });
        };

        $scope.updateResourceList = function () {
            if ($rootScope.networkId === undefined) return;
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceProvider');
            MqNaaSResourceService.list(url).then(function (data) {
                if (data === undefined) return;
                $scope.physicalResources = checkIfIsArray(data.IRootResource.IRootResourceId);
            });
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement';
            MqNaaSResourceService.get(url).then(function (data) {
                if (data === undefined) return;
                $scope.physicalLinks = [];
                checkIfIsArray(data.IResource.IResourceId).forEach(function (link) {
                    url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + link + '/IResourceModelReader/resourceModel/';
                    MqNaaSResourceService.get(url).then(function (data) {
                        if (data === undefined) return;
                        console.log(data);
                        if (!data.resource.resources) return;
                        $scope.physicalLinks.push({
                            id: data.resource.id,
                            from: data.resource.resources.resource[0].id,
                            to: data.resource.resources.resource[1].id
                        });
                    });
                });
            });
        };

        $scope.updateListNetworks();

        var promise = $interval(function () {
            //$scope.updateListNetworks();
            $scope.updateResourceList();
        }, 2000000);

        $scope.$on('$destroy', function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

        $scope.setNetworkId = function (netId) {
            console.log('Select networkId to rootScope: ' + netId);
            $rootScope.networkId = netId;
            $window.localStorage.networkId = netId;
            getMqNaaSResource($rootScope.networkId);
        };

        $scope.createNetwork = function () {
            var xml = getNETWORK();
            RootResourceService.put(xml).then(function (data) {
                $rootScope.networkId = data;
                $scope.updateListNetworks();
            });
        };

        $scope.deleteDialog = function (id) {
            $scope.itemToDeleteId = id;
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/modals/modalRemove.html',
                show: true,
                scope: $scope
            });
        };

        $scope.deleteItem = function (id) {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + id);
            MqNaaSResourceService.remove(url).then(function (data) {
                $alert({
                    title: 'Resource removed',
                    content: 'The resource was removed correctly',
                    placement: 'top',
                    type: 'success',
                    keyboard: true,
                    show: true,
                    container: '#alerts-container',
                    duration: 5
                });
                $scope.updateResourceList();
                var n = $rootScope.network_data.nodes.get({
                    filter: function (item) {
                        return item.label == id;
                    }
                })[0];
                $rootScope.network_data.nodes.remove({
                    id: n.id
                });
            });
            this.$hide();
        };

        var getMqNaaSResource = function (root, url) {
            console.log('GET MQNAAS RESOURCE. SET RESOURCES ' + root);
            if (root === undefined) return;
            url = generateUrl('IRootResourceAdministration', root, 'IRootResourceProvider');
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

                $scope.generateNodeData(checkIfIsArray(data.IRootResource.IRootResourceId));

                $window.localStorage.networkElements = data;
                console.log('Get and store ports');

            }, function (error) {
                console.log('ERROR');
                console.log('handle error');
                console.log(error);
            });
        };

        $scope.getRealPorts = function (resourceName) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                console.log((result.IResource.IResourceId));
                if (result.IResource.IResourceId === undefined) return;
                var ports = [];
                result.IResource.IResourceId.forEach(function (entry) {
                    url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement/' + entry + '/IAttributeStore/attribute/?arg0=portInternalId';
                    MqNaaSResourceService.getText(url).then(function (realPort) {
                        console.log('GET physical port');
                        console.log(realPort);
                        console.log(entry);
                        var p = entry + '(' + realPort + ')';
                        if (realPort > 99) ports.push({
                            '_id': p
                        });
                        console.log(ports);
                        /* localStorageService.set(resourceName, {
                             name: resourceName,
                             ports: {
                                 port: ports
                             }
                         });*/
                    });
                });

                console.log('Set ports');
                console.log(localStorageService.get(resourceName));
            });
        };

        $scope.openAddResourceDialog = function (nodeType, divPos) {
            $scope.resource = {};
            $scope.resource.type = nodeType;
            if (nodeType == 'arn') $scope.resource.endpoint = 'http://fibratv.dtdns.net:41080';
            else if (nodeType == 'cpe') $scope.resource.endpoint = 'http://fibratv.dtdns.net:41081';
            $scope.createDialog = $modal({
                title: 'Adding a new ' + nodeType,
                template: 'views/sodales/resourceDialog.html',
                show: true,
                scope: $scope,
                data: {
                    'nodeType': nodeType,
                    'divPos': divPos
                },
                keyboard: false,
                backdrop: 'static'
            });
        };

        $scope.addResource = function (data) {
            console.log(data);
            $scope.creating = true;
            if (data.type === 'arn') var resource = getResource('ARN', data.endpoint + '/cgi-bin/xml-parser.cgi');
            else if (data.type === 'cpe') var resource = getResource('CPE', data.endpoint);
            console.log(resource);
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration');
            //arnService.setUrl(data.endpoint);
            MqNaaSResourceService.put(url, resource).then(function (res) {
                console.log(res);

                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + res + '/IPortManagement';
                MqNaaSResourceService.get(url).then(function (result) {
                    console.log(result);
                    var ports = checkIfIsArray(result.IResource.IResourceId);

                    $scope.configurePhysicalResource(res, ports);
                    $scope.dataARN = res;
                    $rootScope.network_data.nodes.add({
                        id: $scope.nodes.length,
                        label: res,
                        image: 'images/SODALES_' + data.type.toUpperCase() + '.png',
                        shape: 'image',
                        x: 50,
                        y: 50,
                    });
                    $scope.creating = false;
                    $scope.createDialog.hide();
                    $scope.updateResourceList();
                });
            });
        };

        $scope.createLink = function () {
            console.log('Creating link');
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement';
            MqNaaSResourceService.put(url).then(function (data) {
                $scope.createdLink = data;
                $scope.createdLinkInfo = [{
                    s: $scope.source,
                    t: $scope.dest
                }];
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + $scope.source + '/IPortManagement';
                MqNaaSResourceService.get(url).then(function (result) {
                    console.log(result);
                    $scope.physicalPorts1 = checkIfIsArray(result.IResource.IResourceId);
                });
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + $scope.dest + '/IPortManagement';
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts2 = checkIfIsArray(result.IResource.IResourceId);
                });
                return data;
            });
        };

        $scope.createPort = function (resourceName) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.put(url).then(function (data) {});
        };

        $scope.mappingPortsToLink = function (res1, port1, portInternalId, portEth) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + res1 + '/IPortManagement/' + port1 + '/IAttributeStore/attribute/?arg0=' + portInternalId + '&arg1=' + portEth;
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.mappedPort = 'Mapped';
                $scope.mappedPorts.push({
                    virt: virtualPort,
                    real: realPort
                });
            });
        };

        //unused here
        $scope.attachPortsToLink = function (linkId, type, portId) {
            url;
            if (type === 'source') {
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/srcPort?arg0=' + portId;
                $scope.srcPortAttahed = 'Source port Attached';
            } else if (type === 'dest') {
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/destPort?arg0=' + portId;
                $scope.dstPortAttahed = 'Target port Attached';
            }
            MqNaaSResourceService.put(url).then(function (response) {}); //empty

        };

        $scope.getResourceInfo = function (resourceName) {
            console.log(resourceName);

            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data.resource.resources.resource);
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.ports = checkIfIsArray(data.resource.resources.resource);
                $rootScope.resourceInfo.slicing = {};

                $scope.getSlice(resourceName);
            });


            //$scope.getUnits(); 
            //$scope.getRangeUnit(); 
            //$scope.getCubes();

        };

        $scope.configurePhysicalResource = function (resourceName, ports) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/slice';
            console.log(url);

            MqNaaSResourceService.getText(url).then(function (data) {
                if (data === undefined) return;
                console.log('Slice: ' + data);
                var sliceId = data;
                var unitType = 'port';
                //IRootResourceAdministration/Network-Internal-1.0-2/IRootResourceAdministration/ARN-Internal-1.0-3/ISliceProvider/slice-1/IUnitManagement?arg0=port
                //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IRootResourceAdministration/CPE-Internal-1.0-8/ISliceProvider/slice-6/IUnitManagement/?arg0=port/
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/?arg0=' + unitType;
                MqNaaSResourceService.put(url).then(function (data) {
                    if (data === undefined) return;
                    console.log('Set unit:' + data);
                    var unitId = data;
                    url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId + '/IUnitAdministration/range';
                    var range = getRangeUnit(1, ports.length + 1);
                    MqNaaSResourceService.put(url, range).then(function () {
                        console.log('Set Range1');
                        unitType = 'vlan';
                        url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/?arg0=' + unitType;
                        MqNaaSResourceService.put(url).then(function (data) {
                            if (data === undefined) return;
                            console.log('Set unit:' + data);
                            var unitId = data;
                            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId + '/IUnitAdministration/range';
                            var range = getRangeUnit(1, 2048);
                            MqNaaSResourceService.put(url, range).then(function () {
                                console.log('Set Range2');


                                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/ISliceAdministration/cubes';
                                var cubes = getCube(1, ports.length, 1, 2048);
                                MqNaaSResourceService.put(url, cubes).then(function () {});
                            });
                        });
                    });
                });
            });
        };

        $scope.getSlice = function (resourceName) { //get
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/slice';
            MqNaaSResourceService.getText(url).then(function (data) {
                console.log(data);
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };

                console.log($rootScope.resourceInfo.slicing);
                $scope.getUnits(resourceName, data);
                $scope.getCubes(resourceName, data);
                //return data;
            });
        };

        $scope.getUnits = function (resourceName, sliceId) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement';
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    $scope.getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };

        $scope.getRangeUnit = function (resourceName, sliceId, unitId) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };

        $scope.getCubes = function (resourceName, sliceId) {
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/ISliceAdministration/cubes';
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };

        $scope.getRangeInfo = function (unit) {
            $scope.unit = unit;
            $modal({
                title: 'Unit information about ' + unit.id,
                template: 'views/modals/rangeInfo.html',
                show: true,
                scope: $scope,
            });
        };
        $scope.getCubeInfo = function (cube) {
            $scope.cubes = cube;
            $modal({
                title: 'Cubes information',
                template: 'views/modals/cubesInfo.html',
                show: true,
                scope: $scope,
            });
        };
    });
