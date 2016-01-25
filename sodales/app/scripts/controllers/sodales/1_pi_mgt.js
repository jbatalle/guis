'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, RootResourceService, $window, $modal, $alert, $interval, PhysicalService, IMLService) {
        var url = '';

        $scope.nodes = new vis.DataSet();
        $scope.edges = new vis.DataSet();
        $scope.listNetworks = [];
        $rootScope.resourceInfo = undefined;
        // $scope.buttonToogle = true;

        if ($window.localStorage.networkId) $rootScope.netId = $window.localStorage.networkId;
        else $rootScope.netId = null;

        $scope.updateListNetworks = function () {
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                // RootResourceService.list().then(function (data) {
                if (!data) return;
                //data = checkIfIsArray(data.IRootResource.IRootResourceId);

                $scope.listNetworks = data;
                if ($scope.listNetworks.length === 1) {
                    $rootScope.networkId = '';
                    $window.localStorage.networkId = '';
                }
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    $window.localStorage.networkId = data[1];
                }
                $scope.selectedNetwork = $rootScope.networkId.id;
                $scope.updateResourceList();
            });
        };

        $scope.updateResourceList = function () {
            if ($rootScope.networkId === undefined) return;
            var url = "phyNetworks/" + $rootScope.networkId.id;
            IMLService.get(url).then(function (data) {
                if (data === undefined) return;
                //$scope.physicalResources = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.physicalResources = result.phy_resources;
                if (data === undefined) return;
                $scope.physicalLinks = result.phy_links;
            });
            //url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement';
            //MqNaaSResourceService.get(url).then(function (data) {
            //if (data === undefined) return;
            //$scope.physicalLinks = [];
            /*checkIfIsArray(data.IResource.IResourceId).forEach(function (link) {
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + link + '/IResourceModelReader/resourceModel/';
                MqNaaSResourceService.get(url).then(function (data) {
                    if (data === undefined) return;
                    if (!data.resource.resources) return;
                    if (!Array.isArray(data.resource.resources.resource)) return;
                    $scope.physicalLinks.push({
                        id: data.resource.id,
                        from: data.resource.resources.resource[0].id,
                        to: data.resource.resources.resource[1].id
                    });
                });
            });*/
            //   });
        };

        $scope.updateListNetworks();

        var promise = $interval(function () {
            $scope.updateResourceList();
        }, 2000000);

        $scope.$on('$destroy', function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

        $scope.setNetworkId = function (netId) {
            console.log('Select networkId to rootScope: ' + netId);
            $rootScope.networkId = netId.id;
            $window.localStorage.networkId = netId;
            getMqNaaSResource($rootScope.networkId);
        };

        $scope.createNetwork = function () {
            var xml = getNETWORK();
            var url = "phyNetworks"
            IMLService.port(url).then(function (result) {
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
            var n = $rootScope.network_data.nodes.get({
                filter: function (item) {
                    return item.label == id;
                }
            })[0];

            if (n !== undefined) {
                var url = "phyNetworks/" + $rootScope.networkId.id + "/resource/" + id;
                IMLService.remove(url).then(function (data) {
                    $rootScope.network_data.nodes.remove({
                        id: n.id
                    });
                });
            } else if (n === undefined) {
                var url = "phyNetworks/" + $rootScope.networkId.id + "/link/" + id;
                IMLService.remove(url).then(function (data) {});
                var n = $rootScope.network_data.edges.get({
                    filter: function (item) {
                        return item.label == id;
                    }
                })[0];
                $rootScope.network_data.edges.remove({
                    id: n.id
                });
            }
            $scope.updateResourceList();
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
            this.$hide();
        };

        //it is used????

        var getMqNaaSResource = function (root, url) {
            if (root === undefined) return;
            url = generateUrl('IRootResourceAdministration', root, 'IRootResourceProvider');
            MqNaaSResourceService.list(url).then(function (data) {
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

            }, function (error) {
                console.log('ERROR get Mqnaas resource');
                console.log(error);
            });
        };

        $scope.openAddResourceDialog = function (nodeType, divPos) {
            $scope.resource = {};
            $scope.resource.type = nodeType;
            if (nodeType == 'arn') $scope.resource.endpoint = 'http://fibratv.dtdns.net:41080';
            else if (nodeType == 'cpe') $scope.resource.endpoint = 'http://fibratv.dtdns.net:41081';
            $scope.createDialog = $modal({
                title: 'Adding a new ' + nodeType,
                template: 'views/modals/resourceDialog.html',
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

        //map info

        var areaLat = 41.8,
            areaLng = 2.2167,
            areaZoom = 15;
        //$scope.map = {};
        //$scope.map.clickedMarker = {};
        //$scope.map.clickedMarker.id = "test";
        angular.extend($scope, {
            map: {
                center: {
                    latitude: areaLat,
                    longitude: areaLng
                },
                zoom: areaZoom,
                markers: [],
                clickedMarker: {
                    id: "null"
                },
                events: {
                    click: function (map, eventName, originalEventArgs) {
                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                            lon = e.latLng.lng();
                        var marker = {
                            id: Date.now(),
                            coords: {
                                latitude: lat,
                                longitude: lon
                            }
                        };
                        //$scope.map.markers.push(marker);
                        $scope.map.clickedMarker = marker;
                        console.log($scope.map.markers);
                        $scope.$apply();
                    }
                }
            }
        });

        $scope.addResource = function (resource) {
            console.log(resource);
            console.log($scope.map.clickedMarker);
            $scope.creating = true;
            if (resource.type === 'arn') resource.endpoint = resource.endpoint + '/cgi-bin/xml-parser.cgi';
            //else if (resource.type === 'cpe') resource.endpoint = resource.endpoint;

            resource.type = resource.type.toUpperCase();
            resource.coords = {};
            if ($scope.map.clickedMarker.coords) {
                resource.coords.lat = $scope.map.clickedMarker.coords.latitude;
                resource.coords.lon = $scope.map.clickedMarker.coords.longitude;
            }

            var url = "phyNetworks/" + $rootScope.networkId.id + "/resource/addResource";
            IMLService.post(url, resource).then(function (data) {
                if (data === undefined) {
                    console.log("Resource not generated");
                    return;
                }
                console.log(data);
                //url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + res + '/IPortManagement';
                //MqNaaSResourceService.get(url).then(function (result) {
                //                    var ports = checkIfIsArray(result.IResource.IResourceId);

                //$scope.configurePhysicalResource(res, ports);
                $scope.dataARN = data;
                $rootScope.network_data.nodes.add({
                    //id: $rootScope.network_data.nodes.length,
                    id: Math.floor(Math.random() * (10000000000 - 1)) + 1,
                    label: data,
                    image: 'images/SODALES_' + resource.type.toUpperCase() + '.png',
                    shape: 'image',
                    x: 50,
                    y: 50,
                    type: data.type
                });
                $scope.creating = false;
                $scope.createDialog.hide();
                $scope.updateResourceList();
                // });
            });
        };

        $scope.resizeMap = function () {
            console.log("TEST REZIE");
            google.maps.event.trigger($scope.map, 'resize');
            // $scope.map.setCenter(0);
            //google.maps.event.trigger($scope.map, 'resize');
            //$scope.map.setCenter(marker.position);
        };

        $scope.getResourceInfo = function (resourceName) {
            PhysicalService.getResource(resourceName);
        };
        /*
                $scope.configurePhysicalResource = function (resourceName, ports) {
                    var ranges = "";
                    url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/slice';
                    MqNaaSResourceService.getText(url).then(function (data) {
                        if (data === undefined) return;
                        var sliceId = data;
                        var unitType = 'port';
                        url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/?arg0=' + unitType;
                        MqNaaSResourceService.put(url).then(function (data) {
                            if (data === undefined) return;
                            var unitId = data;
                            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId + '/IUnitAdministration/range';
                            var range = getRangeUnit(1, ports.length + 1);
                            ranges = getRange(1, ports.length + 1);
                            MqNaaSResourceService.put(url, range).then(function () {
                                unitType = 'vlan';
                                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/?arg0=' + unitType;
                                MqNaaSResourceService.put(url).then(function (data) {
                                    if (data === undefined) return;
                                    var unitId = data;
                                    url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId + '/IUnitAdministration/range';
                                    var range = getRangeUnit(1, 4096);
                                    ranges = ranges + getRange(1, 4096);
                                    MqNaaSResourceService.put(url, range).then(function () {
                                        url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/ISliceAdministration/cubes';

                                        //var cubes = getCube3(1, ports.length);
                                        var cubes = getCubes(getCube(getRanges(ranges)));
                                        MqNaaSResourceService.put(url, cubes).then(function () {});
                                    });
                                });
                            });
                        });
                    });
                };
        */
        $scope.getRangeInfo = function (unit) {
            $scope.unit = unit;
            $modal({
                title: 'Unit information about ' + unit.id,
                template: 'views/modals/info/rangeInfo.html',
                show: true,
                scope: $scope,
            });
        };
        $scope.getCubeInfo = function (cube) {
            $scope.cubes = cube;
            $modal({
                title: 'Cubes information',
                template: 'views/modals/info/cubesInfo.html',
                show: true,
                scope: $scope,
            });
        };

        $rootScope.createLinkDialog = function (source, dest) {
            console.log("Create Link dialog");
            $scope.source = source; //$scope.nodes.get(source);
            $scope.dest = dest; //$scope.nodes.get(dest);

            PhysicalService.getPhysicalPorts($scope.source.label).then(function (data) {
                $scope.physicalPorts1 = data;
            });

            PhysicalService.getPhysicalPorts($scope.dest.label).then(function (data) {
                $scope.physicalPorts2 = data;
            });

            $rootScope.createLinkModal = $modal({
                title: 'Adding a new link',
                template: 'views/modals/createLinkDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.createLink = function (srcPort, dstPort) {
            $scope.srcPort = srcPort;
            $scope.dstPort = dstPort;
            console.log(srcPort);
            console.log($scope.source);
            if ($scope.source.type === "ARN") {
                var msrcPort = srcPort;
                srcPort = undefined;
                //url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + $scope.source.label + '/IResourceModelReader/resourceModel/';
                //MqNaaSResourceService.get(url).then(function (result) {
                url = "phyNetworks/" + $rootScope.networkId + "/resource/addResource";
                IMLService.post(url, resource).then(function (data) {
                    var ports = checkIfIsArray(result.resource.resources.resource);
                    srcPort = ports.find(function (p) {
                        return p.attributes.entry[0].value === msrcPort
                    }).id;
                    console.log(srcPort);
                    $scope.srcPort = srcPort.id;
                    console.log("Src port set")
                });
            }
            if ($scope.dest.type === "ARN") {
                var mdstPort = dstPort;
                dstPort = undefined;
                url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + $scope.dest.label + '/IResourceModelReader/resourceModel/';
                MqNaaSResourceService.get(url).then(function (result) {
                    var ports = checkIfIsArray(result.resource.resources.resource);
                    dstPort = ports.find(function (p) {
                        return p.attributes.entry[0].value === mdstPort
                    }).id;
                    $scope.dstPort = dstPort.id;
                });
            }

            $scope.$watchCollection(['srcPort', 'dstPort'], function (newValues, oldValues, scope) {
                console.log(newValues);
                console.log(oldValues);
                console.log($scope.srcPort);
                srcPort = $scope.srcPort;
                dstPort = $scope.dstPort;
                console.log(srcPort);
                console.log(dstPort);
                if (srcPort !== undefined && dstPort !== undefined) {
                    console.log("Creating link now!");
                    var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement';
                    MqNaaSResourceService.put(url).then(function (linkId) {
                        url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/srcPort?arg0=' + srcPort;
                        MqNaaSResourceService.put(url).then(function (response) {});
                        url = 'IRootResourceAdministration/' + $rootScope.networkId + '/ILinkManagement/' + linkId + '/ILinkAdministration/destPort?arg0=' + dstPort;
                        MqNaaSResourceService.put(url).then(function (response) {}); //empty
                        var srcNode = $rootScope.network_data.nodes.get({
                            filter: function (item) {
                                return item.label == $scope.source.label;
                            }
                        })[0];
                        var dstNode = $rootScope.network_data.nodes.get({
                            filter: function (item) {
                                return item.label == $scope.dest.label;
                            }
                        })[0];
                        console.log(srcNode);

                        $rootScope.network_data.edges.add({
                            id: $rootScope.network_data.edges.lentgh,
                            from: srcNode.id,
                            to: dstNode.id,
                            label: linkId
                        });

                        $scope.updateListNetworks();
                        $rootScope.createLinkModal.hide();
                    });
                    //loop = 20;

                }
            })
        };
    });