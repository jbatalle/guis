'use strict';

angular.module('mqnaasApp')
    .controller('viewNetwork', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log('Clean localStorage networkElements due network is not created.');
                localStorageService.set('networkElements', []);
                localStorageService.set('link', []);
                console.log($rootScope.networkId);
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            //mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IResourceModelReader/resourceModel  
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                if (data === undefined) {
                    $rootScope.networkId = undefined;
                    return;
                }
                console.log(data);
                $scope.nodes.add(generateNodeData(data.resource.resources.resource));
                $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
            });
        };

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en'
        };

        $scope.onNodeSelect = function (properties) {
            var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selected);
        };

    })
    .controller('editPhyNetwork', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, $interval) {
        var url = '';
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log('Clean localStorage networkElements due network is not created.');
                localStorageService.set('networkElements', []);
                localStorageService.set('link', []);
                console.log($rootScope.networkId);
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };
        $scope.updateListNetworks();
        var promise = $interval(function () {

            // $scope.updateNetwork();
            //$scope.nodes = new vis.DataSet();
            //$scope.edges = new vis.DataSet();

            //$scope.getNetworkModel();
            /*$scope.network_data = {
                nodes: $scope.nodes,
                edges: $scope.edges
            };*/
        }, 5000);

        $scope.$on('$destroy', function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

        $scope.getNetworkModel = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                if (data === undefined) return;
                $scope.nodes.add(generateNodeData(data.resource.resources.resource));
                $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
            });
        };

        $scope.deleteResource = function (resName) {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
            $scope.nodes = new vis.DataSet();
            $scope.edges = new vis.DataSet();
            $scope.updateListNetworks();
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
                    shape: 'image'
                });
                this.$hide();
            });
        };

        $rootScope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en',
            manipulation: {
                addNode: function (data, callback) {
                    //loadModal
                    console.log(data);
                    console.log(callback);
                    data.id = data.id;
                    data.label = data.id;
                    clearPopUp();
                    callback(data);
                },
                editNode: function (data, callback) {
                    // filling in the popup DOM elements
                },
                addEdge: function (data, callback) {
                    console.log("Adding link");
                    console.log("Open Dialog");
                    $scope.createLinkDialog(data.from, data.to);
                    if (data.from == data.to) {
                        var r = confirm('Do you want to connect the node to itself?');
                        if (r == true) {
                            callback(data);
                        }
                    } else {
                        callback(data);
                    }
                }
            }
        };

        $scope.createLinkDialog = function (source, dest) {
            console.log("Create Link dialog");
            console.log(source);
            console.log(dest);
            $scope.source = $scope.nodes.get(source).label;
            $scope.dest = $scope.nodes.get(dest).label;

            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.source + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.physicalPorts1 = result;
            });
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.dest + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.physicalPorts2 = result;
            });

            $modal({
                title: 'Adding a new link',
                template: 'views/sodales/createLinkDialog.html',
                show: true,
                scope: $scope
            });
        };

        //to remove
        $scope.attachPortsToLink = function (type, portId) {
            var linkId = $scope.createdLink;
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

        $scope.getLinks = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response.unit);
                $scope.links = response.unit;
            });
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

        $scope.onNodeSelect = function (properties) {
            console.log(properties);
            console.log($scope);
            console.log($scope.nodes);
            var resourceName = $scope.nodes.get({
                filter: function (item) {
                    console.log(item);
                    return item.id == properties.nodes[0];
                }
            })[0].label;
            console.log(resourceName);

            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data.resource.resources.resource);
                $rootScope.resourceInfo = checkIfIsArray(data.resource.resources.resource);
                //$scope.generateNodeData(data.resource.resources.resource);
                //$scope.generateLinkData(data.resource.resources.resource);
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


    }).controller('editVINetwork', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, $modal, RootResourceService, arnService, cpeService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        if (localStorageService.get('networkId')) $rootScope.netId = localStorageService.get('networkId');
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set('networkId', data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log('Clean localStorage networkElements due network is not created.');
                localStorageService.set('networkElements', []);
                localStorageService.set('link', []);
                console.log($rootScope.networkId);
                //                getMqNaaSResource($rootScope.networkId);
                $scope.getNetworkModel();

            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $scope.generateNodeData(data.resource.resources.resource);
                $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
            });
        };

        $scope.deleteResource = function (resName) {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
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
                    shape: 'image'
                });
                this.$hide();
            });

        };

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en',
            manipulation: {
                addNode: function (data, callback) {
                    //loadModal
                    console.log(data);
                    console.log(callback);
                    data.id = data.id;
                    data.label = data.id;
                    clearPopUp();
                    callback(data);
                },
                editNode: function (data, callback) {
                    // filling in the popup DOM elements
                },
                addEdge: function (data, callback) {
                    console.log("Adding link");
                    console.log("Open Dialog");
                    $scope.createLinkDialog(data.from, data.to);
                    if (data.from == data.to) {
                        var r = confirm('Do you want to connect the node to itself?');
                        if (r == true) {
                            callback(data);
                        }
                    } else {
                        callback(data);
                    }
                }
            }
        };

        $scope.createLinkDialog = function (source, dest) {
            console.log("Create Link dialog");
            console.log(source);
            console.log(dest);
            $scope.source = $scope.nodes.get(source).label;
            console.log($scope.source);
            $scope.dest = $scope.nodes.get(dest).label;
            $scope.viRes;
            $scope.virtualResources = $scope.getVirtualResources();
            $scope.getPhysicalResources();

            $modal({
                title: 'Adding a new link',
                template: 'views/createVI/mappingPortsDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.attachPortsToLink = function (type, portId) {
            var linkId = $scope.createdLink;
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

        $scope.getLinks = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response.unit);
                $scope.links = response.unit;
            });
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

        $scope.onNodeSelect = function (properties) {
            var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selected);
        };

        $scope.generateNodeData = function (data) {
            data = checkIfIsArray(data);
            //$scope.nodes = new vis.DataSet();
            data.forEach(function (node) {
                console.log(node);
                if (node.type !== undefined && node.type !== 'link' && node.type !== 'Network') {
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image',
                        group: 'physical'
                    });
                } else if (node.type === undefined && node.type !== 'link' && node.type !== 'Network') { //VIR
                    console.log("We are takling about virtual resources");
                    console.log(node);
                    if (node.id !== $scope.viId) return;
                    var vir = checkIfIsArray(node.resources.resource);
                    vir.forEach(function (node) {
                        $scope.nodes.add({
                            id: $scope.nodes.lentgh,
                            label: node.id,
                            image: 'images/SODALES_' + node.type + '.png',
                            shape: 'image',
                            group: 'virtual'
                        });
                    })

                }
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

        $scope.getVirtualResources = function () {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestManagement/' + $scope.viId + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response);
                $scope.virtualResources = checkIfIsArray(response.resource.resources.resource);
                return $scope.virtualResources;
            });

        };

        $scope.getPhysicalResources = function () {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response);
                $scope.physicalResources = checkIfIsArray(response.resource.resources.resource);
                return $scope.physicalResources;
            });
        };
    });

function generateNodeData(data) {
    var nodes = [];
    data = checkIfIsArray(data);
    data.forEach(function (node) {
        if (node.type !== undefined && node.type !== 'link' && node.type !== 'Network') {
            nodes.push({
                id: nodes.lentgh,
                label: node.id,
                image: 'images/SODALES_' + node.type + '.png',
                shape: 'image',
            });
        }
    });
    return nodes;
}

function generateLinkData(data, nodes) {
    var edges = [];
    if (data === undefined) return edges;
    data = checkIfIsArray(data);
    data.forEach(function (node) {
        if (node.resources)
            if (node.type === 'link' && node.resources.resource instanceof Array) {
                var src = {},
                    dst = {};
                data.forEach(function (element) {
                    if (element.type !== 'link') {
                        var t = checkIfIsArray(element.resources.resource);
                        t.forEach(function (port) {
                            if (port.id === node.resources.resource[0].id) src = element;
                        });
                    }
                });

                data.forEach(function (element) {
                    if (element.type !== 'link') {
                        var t = checkIfIsArray(element.resources.resource);
                        t.forEach(function (port) {
                            if (port.id === node.resources.resource[1].id) dst = element;
                        });
                    }
                });
                var srcNode = nodes.get({
                    filter: function (item) {
                        return item.label == src.id;
                    }
                })[0];
                var dstNode = nodes.get({
                    filter: function (item) {
                        return item.label == dst.id;
                    }
                })[0];

                edges.push({
                    id: edges.lentgh,
                    from: srcNode.id,
                    to: dstNode.id
                });
            }
    });
    return edges;
}

function clearPopUp() {
    //document.getElementById('saveButton').onclick = null;
    //document.getElementById('cancelButton').onclick = null;
    //document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data, callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}
