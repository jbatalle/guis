'use strict';

angular.module('mqnaasApp')
    .controller('listVIController', function ($scope, $rootScope, $filter, localStorageService, $interval, $alert, $modal, IMLService) {
        var promise;
        $scope.data = [];
        $scope.requestCollection = [];
        $scope.networkCollection = [];

        $scope.updateVIReqList = function () {

            var url = "viReqNetworks"
            IMLService.get(url).then(function (result) {
                $scope.requestCollection = [];
                if (result === undefined) return;
                $scope.requestCollection = result;
            });

            var url = "viNetworks"
            IMLService.get(url).then(function (result) {
                $scope.networkCollection = [];
                if (result === undefined) return;
                $scope.networkCollection = _.map(result, function (e) {
                    if (e.period.period_end * 1000 < new Date().getTime()) {
                        return _.extend({}, e, {
                            disabled: true
                        });
                    } else {
                        return _.extend({}, e, {
                            disabled: false
                        });
                    }
                });
            });
        };

        $scope.deleteDialog = function (id, type) {
            $scope.itemToDeleteId = id;
            $scope.type = type;
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/modals/modalRemove.html',
                show: true,
                scope: $scope
            });
        };

        $scope.deleteItem = function (id) {
            if ($scope.type === 'request') $scope.deleteVIRequest(id);
            else if ($scope.type === 'network') $scope.deleteVINetwork(id);
            this.$hide();
        };

        $scope.updateVIReqList();
        promise = $interval(function () {
            $scope.updateVIReqList();
        }, 20000000);

        $scope.createVIRequest = function (id) {
            var url = "viReqNetworks";
            IMLService.post(url).then(function (result) {
                $scope.updateVIReqList();
            });
        };
        $scope.deleteVINetwork = function (viReq) {
            var url = "viNetworks/" + viReq
            IMLService.delete(url).then(function (result) {
                $scope.updateVIReqList();
            });
        };

        $scope.deleteVIRequest = function (viReq) {
            var url = "viReqNetworks/" + viReq
            IMLService.delete(url).then(function (result) {
                $scope.updateVIReqList();
            });
        };

        $scope.sendVIRDialog = function (viReq) {
            $scope.viReq = viReq;
            $modal({
                title: 'Creating a new virtual slice',
                template: 'views/modals/sendReqToProcess.html',
                show: true,
                scope: $scope
            });
        };

        $scope.sendVIR = function (viReq, object) {
            this.$hide();
            var name = "";
            if (object) {
                var json = {
                    "id": viReq,
                    "name": object.name
                };
            } else {
                var json = {
                    "id": viReq
                };
            }
            var url = "viNetworks";
            IMLService.post(url, json).then(function (result, error) {
                if (result === undefined) {
                    $alert({
                        title: "Error: ",
                        content: $rootScope.rejection.data,
                        placement: 'top',
                        type: 'danger',
                        keyboard: true,
                        show: true,
                        container: '#alerts-container',
                        duration: 5
                    });
                } else {
                    var creatingAlert = $alert({
                        title: "Processing...",
                        content: "Please wait.",
                        placement: 'top',
                        type: 'info',
                        keyboard: true,
                        show: true,
                        container: '#alerts-container'
                    });
                    promise = $interval(function () {
                        creatingAlert.hide();
                        $alert({
                            title: "New virtual slice created.",
                            content: "",
                            placement: 'top',
                            type: 'success',
                            keyboard: true,
                            show: true,
                            container: '#alerts-container',
                            duration: 5
                        });
                        $scope.updateVIReqList();
                    }, 3000, 1);
                }
            });
        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
    })
    .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $interval, $q, $alert, $modal, VirtualService, IMLService) {

        $rootScope.viId = $stateParams.id;
        $rootScope.virtualPort = [];
        $rootScope.mapPorts = false;
        $rootScope.mappedPorts = [];
        $scope.virtualElements = [];

        var url = "viReqNetworks/" + $scope.viId;
        IMLService.get(url).then(function (result) {
            if (result == null) return;
            if (result.period) {
                $scope.period = result.period;
                $scope.period.startDate = parseInt($scope.period.period_start * 1000);
                $scope.period.endDate = parseInt($scope.period.period_end * 1000);
            }
        });

        $scope.setPeriod = function (period) {
            var jsonPeriod = {
                "period": {
                    "period_start": new Date(period.startDate).getTime() / 1000,
                    "period_end": new Date(period.endDate).getTime() / 1000
                }
            }

            var url = "viReqNetworks/" + $scope.viId;
            IMLService.put(url, jsonPeriod).then(function (result) {
                $alert({
                    title: "Period set.",
                    content: "",
                    placement: 'top',
                    type: 'success',
                    keyboard: true,
                    show: true,
                    container: '#alerts-container',
                    duration: 5
                });
                return;
            });
        };

        $scope.addVirtualPortToResource = function (resourceRequest) {
            var url = "viReqNetworks/" + $scope.viId + "/viReqResource/" + resourceRequest + "/addPort";
            IMLService.post(url).then(function (result) {
                $rootScope.virtualPort.push(result);
                $scope.getMappedResources();
            });
        };

        /*
        $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.physicalPorts = $scope.getPhysicalPorts(realResource);
                //$scope.virtualPorts = $scope.getVirtualPorts(resourceRequest);
                $rootScope.mapPorts = true;
            });
        };
*/
        $scope.generateCube = function (cube) {
            var cube = cube.map(function (e) {
                return parseInt(e)
            });
            //cube.sort();
            cube.sort(function (a, b) {
                return a - b
            });
            var arr = cube;
            var ranges = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj = {};
                obj.lowerBound = arr[i];
                obj.upperBound = arr[i];
                if (arr[i + 1] == arr[i] + 1) {
                    obj.upperBound = arr[i + 1];
                    // loop through next numbers, to prevent repeating longer sequences
                    while (arr[i] + 1 == arr[i + 1]) {
                        obj.upperBound = arr[i + 1];
                        i++;
                    }
                }
                ranges.push(obj);
            }
            return ranges;
            var cubes = [];
            ranges.forEach(function (range) {
                var ranges = getRange(range.lowerBound, range.upperBound);
                ranges = ranges + getRange(100, 200);
                cubes.push(getCube(getRanges(ranges)));
                //cubes.push(getCubeVirtual(range.lowerBound, range.upperBound));
            });
            return getCubes(cubes);
        };
        /*
                $scope.mapVirtualPorts = function (virtualPort, realPort) {
                    console.log("Map virtual ports");
                    //var url = "viReqNetwork/" + $scope.viId + "/viReqResource/" + resourceRequest + "/addPort";
                    //IMLService.post(url).then(function (result) {
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + virtualPort + "&arg1=" + realPort;
                    MqNaaSResourceService.get(url).then(function (result) {
                        $scope.resRoot = result; //empty
                        $rootScope.mappedPort = "Mapped";
                        $rootScope.mappedPorts.push({
                            virt: virtualPort,
                            real: realPort
                        });
                        $scope.getMappedResources();
                    });
                };
                */

        $scope.getPhysicalPorts = function (resourceName) {
            $scope.physicalPorts = [];
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IResourceModelReader/resourceModel";
            MqNaaSResourceService.get(url).then(function (result) {
                if (result === undefined) return;
                $scope.physicalPorts = [];
                checkIfIsArray(result.resource.resources.resource).forEach(function (port) {
                    $scope.physicalPorts.push({
                        onP: port.id,
                        real: port.attributes.entry[0].value
                    });
                });
            });
        };

        $scope.getMappingPort = function (virtualPort) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + virtualPort;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.virtualPorts = result;
            });
        };

        $scope.getMappedResources = function () {
            $rootScope.virtualResources = [];
            var url = "viReqNetworks/" + $scope.viId;
            IMLService.get(url).then(function (response) {
                var virtualResources = checkIfIsArray(response.vi_req_resources);
                angular.forEach(virtualResources, function (viRes) {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + viRes;
                    //MqNaaSResourceService.getText(url).then(function (response) {
                    console.log(viRes);
                    $rootScope.virtualResources.push(viRes);
                    /*$rootScope.virtualResources.push({
                        id: viRes.id,
                        mapped: response,
                        ports: []
                    });*/
                    //$scope.mappPortInfo($rootScope.virtualResources.length - 1, viRes, response)
                    //});
                })
            });
        };

        $scope.mappPortInfo = function (i, viRes, phyRes) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + viRes + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (response) {
                var virtualPorts = checkIfIsArray(response.IResource.IResourceId);
                angular.forEach(virtualPorts, function (viPort) {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + viPort;
                    MqNaaSResourceService.getText(url).then(function (response) {
                        console.log(response);
                        url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + phyRes + "/IPortManagement/" + response + "/IAttributeStore/attribute/?arg0=resource.external.id";
                        MqNaaSResourceService.getText(url).then(function (response) {
                            $rootScope.virtualResources[i].ports.push({
                                id: viPort,
                                mapped: response
                            })
                        });
                    });
                });
            });
        };

        $scope.mappingDialog = function (source, dest) {
            $rootScope.createMappingDialogCall(source, dest, '');
        };

        $scope.getMappedResources();

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
            //http://localhost:9100/rest/mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement/req-6/IRequestResourceManagement/req_root-10/
            var url = "viReqNetworks/" + $scope.viId + "/viReqResource/" + id;
            IMLService.delete(url).then(function (result) {
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

                var n = $rootScope.network_data.nodes.get({
                    filter: function (item) {
                        return item.label == id;
                    }
                })[0];

                if (n !== undefined) {
                    $rootScope.network_data.nodes.remove({
                        id: n.id
                    });
                } else if (n === undefined) {
                    url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'ILinkManagement/' + id);
                    MqNaaSResourceService.remove(url).then(function () {});
                    var n = $rootScope.network_data.edges.get({
                        filter: function (item) {
                            return item.label == id;
                        }
                    })[0];
                    $rootScope.network_data.edges.remove({
                        id: n.id
                    });
                }
                $scope.getMappedResources();
            });
            this.$hide();
        };
    })
    .controller('viewVIController', function ($scope, $rootScope, IMLService, $stateParams, $interval, $q, $alert, VirtualService) {
        $rootScope.virtNetId = $stateParams.id;
        var url = "viNetworks/" + $rootScope.virtNetId;
        IMLService.get(url).then(function (result) {
            if (result === undefined) return;
            console.log(result);
            $scope.vi = result;
            for (var j in $scope.vi.vi_resources) {
                for (var i in $scope.vi.vi_resources[j]) {
                    if ($scope.vi.vi_resources[j][i] === null || $scope.vi.vi_resources[j][i] === undefined) {
                        delete $scope.vi.vi_resources[j][i];
                    }
                    console.log(i);
                    console.log($scope.vi.vi_resources[j]);
                    //if($scope.vi.vi_resources[j][i] !== undefined)
                    //if($scope.vi.vi_resources[j][i].vi_ports !== undefined)
                    if (i = "vi_ports") {
                        console.log($scope.vi.vi_resources[j][i]);
                        for (var t in $scope.vi.vi_resources[j][i]) {
                            console.log(t);
                            for (var w in $scope.vi.vi_resources[j][i][t]) {
                                if ($scope.vi.vi_resources[j][i][t][w] === null || $scope.vi.vi_resources[j][i][t][w] === undefined) {
                                    delete $scope.vi.vi_resources[j][i][t][w];
                                }
                            }
                        }
                    }
                }
            }

            $scope.jsonObj = JSON.stringify($scope.vi, undefined, 4);
        });

        $scope.getResourceInfo = function (element) {
            console.log("CLICK");
            console.log(element);
            url = "viNetworks/" + $rootScope.virtNetId + "/resource/" + element.id;
            IMLService.get(url).then(function (result) {
                if (result === undefined) return;
                $scope.virtualResource = result;
            });
        }
    })
    .controller('mappingCtrl', function ($rootScope, $scope, MqNaaSResourceService, IMLService) {

        $scope.selectedViPorts = [];
        $scope.selectedViVlans = [];
        $scope.selectedPhyVlans = [];
        $scope.selectedPhyPorts = [];
        $scope.mapping = [];
        $scope.mappingVlan = [];

        $scope.virtualVlans = [];
        $scope.physicalVlans = [];

        for (var i = 1; i < 4096; i = i + 127) {
            $scope.virtualVlans.push({
                "lower": i,
                "upper": i + 127
            });
        };

        for (var i = 1; i < 4096; i = i + 127) {
            $scope.physicalVlans.push({
                lower: i,
                upper: i + 127
            });
        };

        $scope.updateTable = function (t) {
            //find this t in mapping and remove .phy
            _.find($scope.mapping, function (n) {
                console.log(n.virt !== t.virt && t.phy === n.phy);
                return n.virt !== t.virt && t.phy === n.phy;
            }).phy = ""
        }

        //watch
        $scope.mapping = [];
        $scope.$watchGroup(['selectedViPorts', 'selectedPhyPorts'], function () {
            $scope.preMapping = [];
            angular.forEach($scope.selectedViPorts, function (port, i) {
                //for (var i = 0; i < $scope.selectedViPorts.length; i++) {
                var url = "phyNetworks/" + $rootScope.networkId.id + "/resource/" + $scope.dest;
                IMLService.get(url).then(function (result) {
                    var ports = checkIfIsArray(result.phy_ports);
                    var srcPort = ports.find(function (p) {
                        return p.id === $scope.selectedPhyPorts[i]
                    });
                    $scope.preMapping.push({
                        virt: $scope.selectedViPorts[i],
                        phy: $scope.selectedPhyPorts[i]
                    });
                    console.log($scope.preMapping)
                    angular.copy($scope.preMapping, $scope.mapping);
                });
            })
        });

        $scope.mappingVlan = [];
        $scope.$watchGroup(['selectedViVlans', 'selectedPhyVlans'], function () {
            $scope.preMappingVlan = [];
            for (var i = 0; i < $scope.selectedViVlans.length; i++) {
                $scope.preMappingVlan.push({
                    virt: $scope.selectedViVlans[i],
                    phy: $scope.selectedPhyVlans[i]
                });
                angular.copy($scope.preMappingVlan, $scope.mappingVlan);
            };
        });


        $scope.map = function (virtualResource, physicalResource) {
            $scope.saving = true;
            $scope.cubes = [];
            console.log($scope.mapping);
            _.map($scope.mapping, function (o) {
                return _.values(_.pick(o, 'phy'));
            });

            //mapping between resources
            var ports = $scope.mapping;
            console.log(ports);
            console.log($scope.mapping);
            console.log($scope.mappingVlan);

            var url = 'phyNetworks/' + $rootScope.networkId.id + '/resource/' + physicalResource;
            IMLService.get(url).then(function (result) {
                console.log(result);
                console.log(result.endpoint);
                var endpoint = result.endpoint;
                //mapping resources
                var mapping = {
                    "id": physicalResource,
                    "endpoint": endpoint
                };
                var url = "viReqNetworks/" + $rootScope.viId + "/viReqResource/" + virtualResource + "/mapResource";
                IMLService.post(url, mapping).then(function (response) {
                    console.log(response);

                    angular.forEach($scope.mapping, function (port) {
                            console.log(port);

                            angular.forEach($scope.mappingVlan, function (vlans) {
                                console.log(vlans);
                                var vlans = {
                                    "upperBound": 1,
                                    "lowerBound": 10
                                }

                                var url = "viReqNetworks/" + $rootScope.viId + "/viReqResource/" + virtualResource + "/mapPort/" + port.virt + "/" + port.phy;
                                IMLService.post(url, vlans).then(function (response) {
                                    console.log(response);
                                });
                            });

                        })
                        /*
                                            angular.forEach($scope.mappingVlan, function (vlans) {
                                                console.log(vlans);
                                            });
                                            var vlans = {
                                                "upperBound": 1,
                                                "lowerBound": 10
                                            }
                                            var url = "viReqNetworks/" + $rootScope.viId + "/viReqResource/" + virtualResource + "/mapVlan";
                                            IMLService.post(url, vlans).then(function (response) {
                                                console.log(response);
                                            });*/
                });
            });


            //mapping ports
            url = "viReqNetworks/$id/viReqResource/$id2/mapPort/$id3/port-123123";

            //mapping vlans
            url = "viReqNetworks/$id/viReqResource/$id2/mapVlan";


            $rootScope.createMappingDialog.hide();
            return;



            var portRanges = $scope.generateCube(_.map($scope.mapping, function (o) {
                return _.values(_.pick(o, 'phy'));
            }));

            var preMapVlan = [];
            _.each($scope.mappingVlan, function (d) {
                preMapVlan = _.union(preMapVlan, _.range(d.virt.lower, d.virt.upper));
            });

            var vlanRanges = $scope.generateCube(preMapVlan);

            //create cube
            _.each(portRanges, function (r) {
                var portRanges = getRange(r.lowerBound, r.upperBound);
                _.each(vlanRanges, function (r) {
                    var vlanRanges = getRange(r.lowerBound, r.upperBound);
                    $scope.cubes.push(getCube(getRanges(portRanges + vlanRanges)));
                });
            });

            console.log(getCubes($scope.cubes));
            //$scope.cubes = $scope.$scope.generateCube(cube);
            $scope.cubes = getCubes($scope.cubes)



            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + virtualResource + "&arg1=" + physicalResource;
            MqNaaSResourceService.getText(url).then(function (result) {

                _.each(ports, function (port) {
                    console.log(port);
                    console.log($scope.physicalPorts[port.phy]);

                    var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + physicalResource + '/IResourceModelReader/resourceModel/';
                    MqNaaSResourceService.get(url).then(function (result) {
                        var ports = checkIfIsArray(result.resource.resources.resource);
                        console.log(ports[port.phy])
                            /*var srcPort = ports.find(function (p) {
                                return p.attributes.entry[0].value === $scope.selectedPhyPorts[i]
                            });*/
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + port.virt + "&arg1=" + ports[port.phy].id;
                        MqNaaSResourceService.get(url).then(function (result) {});
                    });
                })
                $scope.slice = "";
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + virtualResource + "/ISliceProvider/slice";
                MqNaaSResourceService.getText(url).then(function (result) {
                    $scope.slice = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + virtualResource + "/ISliceProvider/" + $scope.slice + "/ISliceAdministration/cubes";
                    MqNaaSResourceService.put(url, $scope.cubes).then(function (result) {
                        $scope.saving = false;
                        $rootScope.createMappingDialog.hide();
                    });
                });
            });
        };

    });
