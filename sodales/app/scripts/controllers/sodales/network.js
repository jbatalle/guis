'use strict';

angular.module('mqnaasApp')
    .controller('viewNetwork', function ($scope, $rootScope, IMLService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.getNetworkModel = function () {
            $scope.$watch(function (rootScope) {
                    return rootScope.networkId
                },
                function () {
                    if ($rootScope.networkId === undefined) return;
                    url = "phyNetworks/" + $rootScope.networkId.id;
                    IMLService.get(url).then(function (data) {
                        if (data === undefined) {
                            $rootScope.networkId = undefined;
                            return;
                        }
                        $scope.nodes.add(generateNodeData(data.phy_resources));
                        $scope.edges.add(generateLinkData(data.phy_links, $scope.nodes));
                    });
                });
        };

        $scope.getNetworkModel();

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            edges: {
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            }
        };

    })
    .controller('editPhyNetwork', function ($scope, $rootScope, $modal, $interval, PhysicalService, IMLService) {
        var url = '';
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.updateListNetworks = function () {
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[0];
                }
                $scope.selectedNetwork = $rootScope.networkId;
                $scope.getNetworkModel();
            });
        };
        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            url = "phyNetworks/" + $rootScope.networkId.id;
            IMLService.get(url).then(function (data) {
                if (data === undefined) return;
                $scope.nodes.add(generateNodeData(data.phy_resources));
                $scope.edges.add(generateLinkData(data.phy_links, $scope.nodes));
            });
        };

        $rootScope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            edges: {
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            },
            locale: 'en',
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
                        callback(null);
                    }
                }
            }
        };
        /*
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
        */
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

    })
    .controller('editVINetwork', function ($scope, $rootScope, $modal, VirtualService, PhysicalService, IMLService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.updateListNetworks = function () {
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[0];
                }
                $scope.selectedNetwork = $rootScope.networkId;
                $scope.getNetworkModel();
            });
        };

        $scope.updateListNetworks();

        $scope.getNetworkModel = function () {
            url = "viReqNetworks/" + $scope.viId;
            IMLService.get(url).then(function (data) {
                data.vi_req_resources = _.map(data.vi_req_resources, function (e) {
                    return _.extend({}, e, {
                        layer: "virtual"
                    });
                });
                $scope.generateNodeData(data.vi_req_resources);
                $scope.edges.add(generateLinkData(data.vi_req_resources, $scope.nodes));
            });
            url = "phyNetworks/" + $rootScope.networkId.id;
            IMLService.get(url).then(function (data) {
                console.log(data);
                $scope.generateNodeData(data.phy_resources);
                $scope.edges.add(generateLinkData(data.phy_links, $scope.nodes));
            });
        };

        $scope.addResource = function (resourceType) {
            console.log("Add resource " + resourceType);
            resourceType = resourceType.toUpperCase();
            var url = "/viReqNetworks/" + $scope.viId + "/viReqResource/addResource";
            var data = {
                "type": resourceType
            };
            IMLService.post(url, data).then(function (virtualResource) {
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
            edges: {
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            },
            locale: 'en',
            manipulation: {
                addNode: false,
                editEdge: false,
                deleteEdge: false,
                deleteNode: false,
                addEdge: function (data, callback) {
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
                var src = $scope.nodes.get({
                    filter: function (item) {
                        return item.label == source;
                    }
                })[0];
                var dst = $scope.nodes.get({
                    filter: function (item) {
                        return item.label == dest;
                    }
                })[0];
                source = src.id;
                dest = dst.id;
                $scope.source = src.label;
                $scope.dest = dst.label;
            }
            $scope.getVirtualResources();
            $scope.getPhysicalResources();
            if ($scope.nodes.get(source).group === "physical") {
                var t = $scope.source;
                $scope.source = $scope.dest;
                $scope.dest = t;
                $rootScope.virtualMappedResource = $scope.dest;
                $rootScope.physicalMappedResource = $scope.source;
            } else {
                $rootScope.virtualMappedResource = $scope.source;
                $rootScope.physicalMappedResource = $scope.dest;
            }
            VirtualService.getResource($scope.source);
            //VirtualService.getRequestPorts($scope.source);
            console.log($scope.source);
            console.log($scope.dest);
            PhysicalService.getResource($scope.dest, function () {});
            PhysicalService.getPhysicalPorts($scope.dest).then(function (ports) {
                $scope.physicalPorts = ports;
            });

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
            var url;
            if (selectedResource.group === 'physical') PhysicalService.getResource(selectedResource.label);
            else VirtualService.getResource(selectedResource.label);
        };

        $scope.generateNodeData = function (data) {
            data = checkIfIsArray(data);
            //$scope.nodes = new vis.DataSet();
            data.forEach(function (node) {
                if (node.type !== undefined && node.type !== 'link' && node.type !== 'Network' && node.layer !== 'virtual') {
                    //put in the other half
                    var x = 10,
                        y = 400;
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image',
                        group: 'physical',
                        type: node.type
                    });
                } else if (node.type !== 'link' && node.type !== 'Network' && node.layer === 'virtual') { //VIR
                    $scope.nodes.add({
                        id: $scope.nodes.lentgh,
                        label: node.id,
                        image: 'images/SODALES_' + node.type + '.png',
                        shape: 'image',
                        group: 'virtual',
                        type: node.type
                    });
                    //if (node.id !== $scope.viId) return;
                    //var vir = checkIfIsArray(node.resources.resource);
                    /*vir.forEach(function (node) {
                        $scope.nodes.add({
                            id: $scope.nodes.lentgh,
                            label: node.id,
                            image: 'images/SODALES_' + node.type + '.png',
                            shape: 'image',
                            group: 'virtual',
                            type: node.type
                        });
                    })*/
                }
            });
        };

        $scope.getVirtualResources = function () {
            url = "/viReqNetworks/" + $scope.viId;
            IMLService.get(url).then(function (data) {
                $rootScope.virtualResources = checkIfIsArray(data.vi_req_resources);
            });
        };

        $scope.getPhysicalResources = function () {
            $scope.physicalResources = [];
            url = "phyNetworks/" + $rootScope.networkId.id;
            IMLService.get(url).then(function (response) {
                var rawResources = checkIfIsArray(response.phy_resource);
                angular.forEach(rawResources, function (resource) {
                    if (resource.type !== 'Network' && resource.type !== 'link' && resource.type !== undefined)
                        $scope.physicalResources.push(resource);
                });
            });
        };
    })
    .controller('spViewNetwork', function ($scope, $rootScope, VirtualService, IMLService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.getNetworkModel = function () {
            $scope.$watch(function (rootScope) {
                    return rootScope.networkId
                },
                function () {
                    if ($rootScope.networkId === undefined) return;

                    url = "viNetworks/" + $rootScope.virtNetId;
                    IMLService.get(url).then(function (data) {
                        if (data === undefined) {
                            $rootScope.networkId = undefined;
                            return;
                        }
                        $scope.nodes.add(generateNodeData(data.vi_resources));
                        $scope.edges.add(generateLinkData(data.vi_resources, $scope.nodes));
                    });
                });
        };

        $scope.getNetworkModel();

        $scope.network_data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        };

        $scope.network_options = {
            edges: {
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                stabilization: false,
                barnesHut: {
                    "springConstant": 0
                }
            },
            locale: 'en'
        };

        $scope.onNodeSelect = function (properties) {
            var virtualResource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0].label;
            //VirtualService.virtualPorts(virtualResource);
            VirtualService.getResourceNetwork(virtualResource);
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
    data.forEach(function (link) {
        //if (node.resources)
        //if (link)
        //if (node.type === 'link' && node.resources.resource instanceof Array) {
        var src = {},
            dst = {};
        /*data.forEach(function (element) {
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
        });*/
        var srcNode = nodes.get({
            filter: function (item) {
                return item.label == link.resource_from;
            }
        })[0];
        var dstNode = nodes.get({
            filter: function (item) {
                return item.label == link.resource_target;
            }
        })[0];

        edges.push({
            id: edges.lentgh,
            from: srcNode.id,
            to: dstNode.id,
            label: link.id
        });
        //}
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
