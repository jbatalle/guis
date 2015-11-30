'use strict';

angular.module('mqnaasApp')
    .controller('viewNetwork', function ($scope, $rootScope, MqNaaSResourceService, RootResourceService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.getNetworkModel = function () {
            $scope.$watch(function (rootScope) {
                    return rootScope.networkId
                },
                function () {
                    if ($rootScope.networkId === undefined) return;
                    url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
                    MqNaaSResourceService.list(url).then(function (data) {
                        if (data === undefined) {
                            $rootScope.networkId = undefined;
                            return;
                        }
                        $scope.nodes.add(generateNodeData(data.resource.resources.resource));
                        $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
                    });
                });
        };

        $scope.getNetworkModel();

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            }
        };
    })
    .controller('editPhyNetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService, $interval, PhysicalService) {
        var url = '';
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                }
                $scope.selectedNetwork = $rootScope.networkId;
                $scope.getNetworkModel();

            });
        };
        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                if (data === undefined) return;
                $scope.nodes.add(generateNodeData(data.resource.resources.resource));
                $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
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
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            },
            manipulation: {
                addNode: false,
                editEdge: false,
                deleteNode: false,
                deleteEdge: false,
                addEdge: function (data, callback) {
                    console.log("Adding link");
                    $rootScope.createLinkDialog($scope.nodes.get(data.from), $scope.nodes.get(data.to));
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
            var resource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0];
            if (resource) {
                var resourceName = resource.label;
                PhysicalService.getResource(resourceName);
            }
        };

        $scope.createPort = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.put(url).then(function (data) {});
        };
    })
    .controller('editVINetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService, VirtualService, PhysicalService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                }
                $scope.selectedNetwork = $rootScope.networkId;
                $scope.getNetworkModel();
            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IResourceModelReader/resourceModel');
            MqNaaSResourceService.list(url).then(function (data) {
                $scope.generateNodeData(data.resource.resources.resource);
                $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
            });
        };

        $scope.addResource = function (resourceType) {
            console.log("Add resource " + resourceType);
            resourceType = resourceType.toUpperCase();
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/?arg0=" + resourceType;
            MqNaaSResourceService.put(url).then(function (virtualResource) {
                $rootScope.resourceRequest = virtualResource;
                $scope.nodes.add({
                    id: $scope.nodes.length,
                    label: virtualResource,
                    image: 'images/SODALES_' + resourceType.toUpperCase() + '.png',
                    shape: 'image',
                    type: resourceType
                });
                $rootScope.virtualPort = [];
            });
        };

        $rootScope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en',
            manipulation: {
                addNode: false,
                editEdge: false,
                deleteEdge: false,
                deleteNode: false,
                addEdge: function (data, callback) {
                    console.log("Adding link");
                    $rootScope.createMappingDialogCall(data.from, data.to, 'vis');
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

        $rootScope.createMappingDialogCall = function (source, dest, type) {
            console.log("Create mapping dialog");
            $rootScope.mapPorts = false;
            $rootScope.mappedPort = "";
            $rootScope.mappedPorts = [];
            if (type === 'vis') {
                $scope.source = $scope.nodes.get(source).label;
                $scope.dest = $scope.nodes.get(dest).label;
            } else {
                $scope.source = source;
                $scope.dest = dest;
            }
            $scope.getVirtualResources();
            $scope.getPhysicalResources();

            if ($scope.nodes.get(source).group === "physical") {
                VirtualService.getRequestPorts($scope.dest);
                PhysicalService.getPhysicalPorts($scope.source).then(function (ports) {
                    $scope.physicalPorts = ports;
                });
            } else {
                VirtualService.getRequestPorts($scope.source);
                PhysicalService.getPhysicalPorts($scope.dest).then(function (ports) {
                    $scope.physicalPorts = ports;
                });
            }




            $rootScope.createMappingDialog = $modal({
                title: 'Mapping virtual resource to physical resource',
                //template: 'views/modals/mappingPortsDialog.html',
                template: 'views/modals/mappingResourcesDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.onNodeSelect = function (properties) {
            var selectedResource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0];
            //var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selectedResource);
            console.log(selectedResource.label);
            var url;
            if (selectedResource.group === 'physical') PhysicalService.getResource(selectedResource.label);
            else VirtualService.getResource(selectedResource.label);
        };

        $scope.generateNodeData = function (data) {
            data = checkIfIsArray(data);
            //$scope.nodes = new vis.DataSet();
            data.forEach(function (node) {
                if (node.type !== undefined && node.type !== 'link' && node.type !== 'Network') {
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image',
                        group: 'physical',
                        type: node.type
                    });
                } else if (node.type === undefined && node.type !== 'link' && node.type !== 'Network') { //VIR
                    if (node.id !== $scope.viId) return;
                    var vir = checkIfIsArray(node.resources.resource);
                    vir.forEach(function (node) {
                        $scope.nodes.add({
                            id: $scope.nodes.lentgh,
                            label: node.id,
                            image: 'images/SODALES_' + node.type + '.png',
                            shape: 'image',
                            group: 'virtual',
                            type: node.type
                        });
                    })
                }
            });
        };

        $scope.createPort = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IPortManagement';
            MqNaaSResourceService.put(url).then(function (data) {});
        };

        $scope.getVirtualResources = function () {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestManagement/' + $scope.viId + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.get(url).then(function (response) {
                $rootScope.virtualResources = checkIfIsArray(response.resource.resources.resource);
            });
        };

        $scope.getPhysicalResources = function () {
            $scope.physicalResources = [];
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.get(url).then(function (response) {
                var rawResources = checkIfIsArray(response.resource.resources.resource);
                angular.forEach(rawResources, function (resource) {
                    if (resource.type !== 'Network' && resource.type !== 'link' && resource.type !== undefined)
                        $scope.physicalResources.push(resource);
                });
            });
        };
    })
    .controller('spViewNetwork', function ($scope, $rootScope, MqNaaSResourceService, RootResourceService, VirtualService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.getNetworkModel = function () {
            $scope.$watch(function (rootScope) {
                    return rootScope.networkId
                },
                function () {
                    if ($rootScope.networkId === undefined) return;
                    url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRequestBasedNetworkManagement/' + $rootScope.virtNetId + '/IResourceModelReader/resourceModel');
                    MqNaaSResourceService.list(url).then(function (data) {
                        if (data === undefined) {
                            $rootScope.networkId = undefined;
                            return;
                        }
                        $scope.nodes.add(generateNodeData(data.resource.resources.resource));
                        $scope.edges.add(generateLinkData(data.resource.resources.resource, $scope.nodes));
                    });
                });
        };

        $scope.getNetworkModel();

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            layout: {
                randomSeed: 3
            }, // just to make sure th layout is the same when the locale is changed
            locale: 'en',
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            }
        };

        $scope.onNodeSelect = function (properties) {
            var virtualResource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0].label;
            VirtualService.virtualPorts(virtualResource);
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
                type: node.type
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
                    to: dstNode.id,
                    label: node.id
                });
            }
    });
    return edges;
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
