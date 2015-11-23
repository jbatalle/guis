'use strict';

angular.module('mqnaasApp')
    .controller('listVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, localStorageService, $interval, $alert, $modal) {
        var promise;
        $scope.data = [];
        $scope.requestCollection = [];
        $scope.networkCollection = [];

        $scope.updateVIReqList = function () {
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                $scope.requestCollection = [];
                if (result === undefined) return;
                var viReqs = checkIfIsArray(result.IResource.IResourceId);
                viReqs.forEach(function (viReq) {
                    var urlVirtNets = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestManagement/' + viReq + '/IResourceModelReader/resourceModel';
                    MqNaaSResourceService.list(urlVirtNets).then(function (viReqInfo) {
                        $scope.requestCollection.push({
                            id: viReq,
                            created_at: viReqInfo.resource.attributes.entry.value
                        });
                    });
                });
            });

            var urlVirtNets = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement';
            MqNaaSResourceService.list(urlVirtNets).then(function (result) {
                $scope.networkCollection = [];
                if (result === undefined) return;
                var viNets = checkIfIsArray(result.IRootResource.IRootResourceId);
                viNets.forEach(function (viNet) {
                    var urlVirtNets = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement/' + viNet + '/IResourceModelReader/resourceModel';
                    MqNaaSResourceService.list(urlVirtNets).then(function (viInfo) {
                        $scope.networkCollection.push({
                            id: viNet,
                            created_at: viInfo.resource.attributes.entry.value
                        });
                    });
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
        };

        $scope.updateVIReqList();
        promise = $interval(function () {
            $scope.updateVIReqList();
        }, 20000000);

        $scope.createVIRequest = function (id) {
            var urlCreateVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                if (result == null) return;
                $scope.updateVIReqList();
            });
        };
        $scope.deleteVINetwork = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + viReq;
            MqNaaSResourceService.remove(url).then(function (result) {
                $scope.updateVIReqList();
                this.$hide();
            });
        };

        $scope.deleteVIRequest = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + viReq;
            MqNaaSResourceService.remove(url).then(function (result) {
                $scope.updateVIReqList();
            });
        };

        $scope.sendVIR = function (viReq) {
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

                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result; //empty
                    $rootScope.info = viReq + " created";
                    $rootScope.info = "200 - Virtual slice created";
                    $scope.updateVIReqList();
                });
            });
        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

    })
    .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $interval, $q, $alert, $modal, VirtualService) {

        $rootScope.viId = $stateParams.id;
        $rootScope.virtualPort = [];
        $scope.mapPorts = false;
        $scope.mappedPorts = [];
        $scope.virtualElements = [];

        var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
        MqNaaSResourceService.get(urlPeriod).then(function (result) {
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
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceRequest + "/IPortManagement";
            MqNaaSResourceService.put(url).then(function (result) {
                $rootScope.virtualPort.push(result);
            });
        };

        $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.physicalPorts = $scope.getPhysicalPorts(realResource);
                $scope.virtualPorts = $scope.getVirtualPorts(resourceRequest);
                $scope.mapPorts = true;
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
            cube.sort();
            var arr = cube;
            var ranges = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                obj = {};
                obj.initial = arr[i];
                obj.final = arr[i];
                if (arr[i + 1] == arr[i] + 1) {
                    obj.final = arr[i + 1];
                    //results.push(i);

                    // loop through next numbers, to prevent repeating longer sequences
                    while (arr[i] + 1 == arr[i + 1]) {
                        obj.final = arr[i + 1];
                        i++;
                    }
                }
                ranges.push(obj);
            }
            console.log(ranges);

            var cubes = [];
            ranges.forEach(function (range) {
                var ranges = getRange(range.initial, range.final);
                ranges = ranges + getRange(100, 200);
                cubes.push(getCube(getRanges(ranges)));
                //cubes.push(getCubeVirtual(range.initial, range.final));
            });

            console.log(getCubes(cubes));

            //return ranges;
            return getCubes(cubes);
        };

        $scope.mapVirtualPorts = function (virtualPort, realPort) {
            console.log("Map virtual ports");
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + virtualPort + "&arg1=" + realPort;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.mappedPort = "Mapped";
                $scope.mappedPorts.push({
                    virt: virtualPort,
                    real: realPort
                });
            });
        };

        $scope.sendVIR = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                $rootScope.info = viReq + " created";
            });

            $rootScope.info = viReq + " created";
        };

        $scope.getVirtualPorts = function (virtualRes) {
            console.log(virtualRes);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualRes + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.virtualPorts = checkIfIsArray(result.IResource.IResourceId);
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

        $scope.configureVirtualResource = function (virtResource) {
            console.log(virtResource);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (data) {
                var sliceId = data;
                var unitType = "port";
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/?arg0=" + unitType;
                MqNaaSResourceService.put(url).then(function (data) {
                    console.log("SET unit" + data);
                    var unitId = data;
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                    var range = getRangeUnit(1, 2);
                    MqNaaSResourceService.put(url, range).then(function () {

                        var unitType = "vlan";
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/?arg0=" + unitType;
                        MqNaaSResourceService.put(url).then(function (data) {
                            var unitId = data;
                            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                            var range = getRangeUnit(1, 2);
                            MqNaaSResourceService.put(url, range).then(function () {

                                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
                                var cubes = getCube(1, 1, 2, 2);
                                MqNaaSResourceService.put(url, cubes).then(function () {});
                            });
                        });
                    });
                });
            });
        };

        $scope.getMappedResources = function () {
            $scope.virtualResources = [];
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement";

            MqNaaSResourceService.get(url).then(function (response) {
                var virtualResources = checkIfIsArray(response.IResource.IResourceId);
                angular.forEach(virtualResources, function (viRes) {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + viRes;
                    MqNaaSResourceService.getText(url).then(function (response) {
                        console.log(response);
                        $scope.virtualResources.push({
                            id: viRes,
                            mapped: response,
                            ports: []
                        });
                        $scope.mappPortInfo($scope.virtualResources.length - 1, viRes)

                        //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IRequestManagement/req-1/IRequestResourceManagement/req_root-1/IPortManagement

                    });
                })
            });
        };

        $scope.mappPortInfo = function (i, viRes) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + viRes + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (response) {
                var virtualPorts = checkIfIsArray(response.IResource.IResourceId);
                angular.forEach(virtualPorts, function (viPort) {
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + viPort;
                    MqNaaSResourceService.getText(url).then(function (response) {
                        $scope.virtualResources[i].ports.push({
                            id: viPort,
                            mapped: response
                        })
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
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRequestManagement/' + $scope.viId + "/IRequestResourceManagement/" + id);
            MqNaaSResourceService.remove(url).then(function () {
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
                }
                $scope.updateResourceList();
            });
            this.$hide();
        };
    })
    .controller('viewVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $interval, $q, $alert, VirtualService) {
        $rootScope.virtNetId = $stateParams.id;
    });
