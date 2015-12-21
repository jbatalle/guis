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
                console.log(result);
                $scope.requestCollection = [];
                if (result === undefined) return;
                var viReqs = result;
                $scope.requestCollection = result;
            });

            var url = "viNetworks"
            IMLService.get(url).then(function (result) {
                console.log(result);
                $scope.networkCollection = [];
                if (result === undefined) return;
                var viNets = result;
                $scope.networkCollection = result;
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

        $scope.sendVIR = function (viReq) {

            var url = "viNetworks"
            var json = {
                "id": viReq
            };
            IMLService.post(url, json).then(function (result) {
                console.log(result);
                $scope.updateVIReqList();
            });


            //check if period is defined
            var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + viReq + "/IRequestAdministration/period";
            MqNaaSResourceService.get(urlPeriod).then(function (result) {
                if (result === null) {
                    $alert({
                        title: "Some fields not defined",
                        content: "Period information is missing",
                        placement: 'top',
                        type: 'danger',
                        keyboard: true,
                        show: true,
                        container: '#alerts-container',
                        duration: 5
                    });
                    return;
                }

                if (result !== null) {
                    var creatingAlert = $alert({
                        title: "Processing...",
                        content: "Please wait.",
                        placement: 'top',
                        type: 'info',
                        keyboard: true,
                        show: true,
                        container: '#alerts-container'
                    });
                }

                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    creatingAlert.hide();
                    $scope.resRoot = result; //empty
                    console.log(result);
                    if (result === undefined || result === null) {
                        $alert({
                            title: "Error creating network",
                            content: "",
                            placement: 'top',
                            type: 'danger',
                            keyboard: true,
                            show: true,
                            container: '#alerts-container',
                            duration: 5
                        });
                        return;
                    } else {
                        $rootScope.info = viReq + " created";
                        $rootScope.info = "200 - Virtual slice created";
                        $scope.updateVIReqList();
                        $alert({
                            title: "New virtual network created.",
                            content: result,
                            placement: 'top',
                            type: 'success',
                            keyboard: true,
                            show: true,
                            container: '#alerts-container',
                            duration: 5
                        });
                        return;
                    }
                });
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

        var url = "viReqNetwork/" + $scope.viId;
        IMLService.get(url).then(function (result) {
            if (result == null) return;
            $scope.period = result.period;
            $scope.period.startDate = parseInt($scope.period.startDate * 1000);
            $scope.period.endDate = parseInt($scope.period.endDate * 1000);
        });

        $scope.setPeriod = function (period) {
            var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
            var onPeriod = getPeriod(new Date(period.startDate).getTime() / 1000, new Date(period.endDate).getTime() / 1000); //xml
            MqNaaSResourceService.put(urlPeriod, onPeriod).then(function () { //the response is empty
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
            var url = "viReqNetwork/" + $scope.viId + "/viReqResource/" + resourceRequest + "/addPort";
            IMLService.post(url).then(function (result) {
                $rootScope.virtualPort.push(result);
                $scope.getMappedResources();
            });
        };

        $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.physicalPorts = $scope.getPhysicalPorts(realResource);
                //$scope.virtualPorts = $scope.getVirtualPorts(resourceRequest);
                $rootScope.mapPorts = true;
            });
        };

        $scope.createCubes = function (virtualResource) {
            $scope.saving = true;
            $rootScope.viId = $scope.viId;
            var url;
            var cube = [];
            //get virtual Ports of the resource

            $scope.slice = "";
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualResource + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (result) {
                $scope.slice = result;
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + virtualResource;
                MqNaaSResourceService.getText(url).then(function (result) {
                    var physicalResource = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualResource + "/IPortManagement";
                    MqNaaSResourceService.get(url).then(function (ports) {

                        $scope.listVirtualPorts = checkIfIsArray(ports.IResource.IResourceId);
                        if ($scope.listVirtualPorts.length === 0) {
                            //create cube?
                            return; //for the moment
                        }
                        var currentRequest = 0;
                        var deferred = $q.defer();
                        makeNextRequest();

                        function makeNextRequest() {
                            var portId = $scope.listVirtualPorts[currentRequest];
                            var virtualPorts = [];
                            //angular.forEach(checkIfIsArray(ports.IResource.IResourceId), function (portId) {
                            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + portId;
                            MqNaaSResourceService.getText(url).then(function (result) {
                                if (result === "") {
                                    if (currentRequest < $scope.listVirtualPorts.length - 1) {
                                        currentRequest++;
                                        makeNextRequest();
                                    } else {
                                        $scope.cubes = $scope.generateCube(cube);
                                        url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualResource + "/ISliceProvider/" + $scope.slice + "/ISliceAdministration/cubes";
                                        MqNaaSResourceService.put(url, $scope.cubes).then(function (result) {});
                                        deferred.resolve();
                                    }
                                }
                                virtualPorts.push(result);
                                var virtualPort = result;
                                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + physicalResource + "/IPortManagement";
                                MqNaaSResourceService.get(url).then(function (result) {
                                    console.log(result);
                                    var physicalPorts = checkIfIsArray(result.IResource.IResourceId);

                                    for ($scope.j = 0; $scope.j < physicalPorts.length; $scope.j++) {
                                        if (physicalPorts[$scope.j] === virtualPort) {
                                            cube.push($scope.j + 1);
                                            break;
                                        }
                                    };
                                    if (currentRequest < $scope.listVirtualPorts.length - 1) {
                                        currentRequest++;
                                        makeNextRequest();
                                    } else {
                                        console.log(currentRequest);
                                        console.log(cube);
                                        console.log("Call cubes generator");
                                        $scope.cubes = $scope.generateCube(cube);

                                        url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualResource + "/ISliceProvider/" + $scope.slice + "/ISliceAdministration/cubes";
                                        MqNaaSResourceService.put(url, $scope.cubes).then(function (result) {
                                            $scope.saving = false;
                                            $rootScope.createMappingDialog.hide();
                                        });

                                        deferred.resolve();
                                    }

                                });
                            });
                        };
                    });
                });
            });
        };

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
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement";

            MqNaaSResourceService.get(url).then(function (response) {
                var virtualResources = checkIfIsArray(response.IResource.IResourceId);
                angular.forEach(virtualResources, function (viRes) {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + viRes;
                    MqNaaSResourceService.getText(url).then(function (response) {
                        console.log(response);
                        $rootScope.virtualResources.push({
                            id: viRes,
                            mapped: response,
                            ports: []
                        });
                        $scope.mappPortInfo($rootScope.virtualResources.length - 1, viRes, response)
                    });
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
            var url = "viReqNetwork/" + $scope.viId + "/viReqResource/" + id;
            IMLService.post(url).then(function (result) {
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
    .controller('viewVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $interval, $q, $alert, VirtualService) {
        $rootScope.virtNetId = $stateParams.id;
    })
    .controller('mappingCtrl', function ($rootScope, $scope, MqNaaSResourceService) {

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
                var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + $scope.dest + '/IResourceModelReader/resourceModel/';
                MqNaaSResourceService.get(url).then(function (result) {
                    var ports = checkIfIsArray(result.resource.resources.resource);
                    var srcPort = ports.find(function (p) {
                        return p.attributes.entry[0].value === $scope.selectedPhyPorts[i]
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