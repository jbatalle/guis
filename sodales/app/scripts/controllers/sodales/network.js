'use strict';

angular.module('mqnaasApp')
    .controller('viewNetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService) {
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
                        console.log(data);
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
            locale: 'en'
        };
    })
    .controller('editPhyNetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService, $interval) {
        var url = '';
        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        $scope.updateListNetworks = function () {
            RootResourceService.list().then(function (data) {
                if (!data) return;
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                console.log('UpdateList nts');
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
                addNode: false,
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

            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement';
            MqNaaSResourceService.put(url).then(function (data) {
                $scope.createdLink = data;
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.source + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts1 = checkIfIsArray(result.IResource.IResourceId);

                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.dest + "/IPortManagement";
                    MqNaaSResourceService.get(url).then(function (result) {
                        $scope.physicalPorts2 = checkIfIsArray(result.IResource.IResourceId);;
                    });
                });
            });

            $scope.source = $scope.nodes.get(source).label;
            $scope.dest = $scope.nodes.get(dest).label;

            $modal({
                title: 'Adding a new link',
                template: 'views/sodales/createLinkDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.attachPortsToLink = function (linkId, type, portId) {
            var url;
            if (type === 'source') {
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/srcPort?arg0=' + portId;
                $scope.srcPortAttahed = 'Source port Attached';
            } else if (type === 'dest') {
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/destPort?arg0=' + portId;
                $scope.dstPortAttahed = 'Target port Attached';
            }
            MqNaaSResourceService.put(url).then(function (response) {}); //empty

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
            var resourceName = $scope.nodes.get({
                filter: function (item) {
                    console.log(item);
                    return item.id == properties.nodes[0];
                }
            })[0].label;
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data.resource.resources.resource);
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.ports = checkIfIsArray(data.resource.resources.resource);
                //$scope.generateNodeData(data.resource.resources.resource);
                //$scope.generateLinkData(data.resource.resources.resource);

                $scope.getSlice(resourceName);
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

        $scope.getSlice = function (resourceName) { //get
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (data) {
                $rootScope.resourceInfo.slicing = {};
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };

                $scope.getUnits(resourceName, data);
                $scope.getCubes(resourceName, data);
            });
        };

        $scope.getUnits = function (resourceName, sliceId) {
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement";
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    $scope.getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };

        $scope.getRangeUnit = function (resourceName, sliceId, unitId) {
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };
        $scope.getCubes = function (resourceName, sliceId) {
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };

    })
    .controller('editVINetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService) {
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

        $scope.deleteResource = function (resName) {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceAdministration/' + resName);
            MqNaaSResourceService.remove(url).then(function (data) {});
        };

        $scope.addResource = function (resourceType) {
            console.log("Add resource " + resourceType);
            resourceType = resourceType.toUpperCase();
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/?arg0=" + resourceType;
            MqNaaSResourceService.put(url).then(function (virtualResource) {
                $scope.resourceRequest = virtualResource;
                $scope.nodes.add({
                    id: $scope.nodes.length,
                    label: virtualResource,
                    image: 'images/SODALES_' + resourceType.toUpperCase() + '.png',
                    shape: 'image'
                });
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
                addNode: false,
                editNode: function (data, callback) {
                    // filling in the popup DOM elements
                },
                addEdge: function (data, callback) {
                    console.log("Adding link");
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
            $scope.source = $scope.nodes.get(source).label;
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
            var selectedResource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0];
            //var selected = $scope.task_nodes.get(properties.nodes[0]);
            console.log(selectedResource);
            console.log(selectedResource.label);
            var url;
            if (selectedResource.group === 'physical') url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + selectedResource.label + '/IResourceModelReader/resourceModel';
            else url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestManagement/' + $rootScope.viId + '/IRequestResourceManagement/' + selectedResource.label + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo = data.resource;
                console.log($rootScope.resourceInfo);
                $rootScope.resourceInfo.ports = [];
                $rootScope.resourceInfo.ports = checkIfIsArray(data.resource.resources.resource);
            });
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

    })
    .controller('spViewNetwork', function ($scope, $rootScope, MqNaaSResourceService, $modal, RootResourceService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();

        console.log($rootScope.virtNetId);

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
            locale: 'en'
        };

        $scope.onNodeSelect = function (properties) {
            var virtualResource = $scope.nodes.get({
                filter: function (item) {
                    return item.id == properties.nodes[0];
                }
            })[0].label;

            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement/' + $rootScope.virtNetId + '/IRootResourceProvider/' + virtualResource + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                $rootScope.virtualResource = data.resource;
                $rootScope.physicalPorts = checkIfIsArray(data.resource.resources.resource);

                $rootScope.virtualResource.ports = [];

                var ports = $rootScope.physicalPorts;
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/slice";
                MqNaaSResourceService.getText(url).then(function (result) {
                    var slice = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/" + slice + "/ISliceAdministration/cubes";
                    MqNaaSResourceService.get(url).then(function (result) {
                        var cubes = checkIfIsArray(result.cubesList.cubes);
                        cubes.forEach(function (cube) {
                            if (cube.cube.ranges.range.lowerBound === cube.cube.ranges.range.upperBound) {
                                $rootScope.virtualResource.ports.push(ports[parseInt(cube.cube.ranges.range.lowerBound)]);
                            } else {
                                var k = parseInt(cube.cube.ranges.range.lowerBound);
                                while (k <= parseInt(cube.cube.ranges.range.upperBound)) {
                                    $rootScope.virtualResource.ports.push(ports[k]);
                                    k++;
                                }
                            }
                        });
                    });
                });
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
