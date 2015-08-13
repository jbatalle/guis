'use strict';

angular.module('mqnaasApp')
    .controller('listVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, viService, localStorageService, $interval, viNetService) {

        //            $rootScope.networkId = "Network-Internal-1.0-2";//to remove
        var promise;
        $scope.data = [];
        $scope.updateSpList = function () {
            viService.list().then(function (result) {
                console.log(result);
                $scope.data = result;
                $scope.dataCollection = result;
            });
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                //                    $scope.data = result.IResource.IResourceId;
            });
        };

        $scope.updateSpList();
        promise = $interval(function () {
            $scope.updateSpList();
        }, 2000);
        $scope.createVIRequest = function () {
            var urlCreateVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                //                    $scope.data.push(result);
                console.log(result);
                if (result == null)
                    return;
                var vi = {
                    "name": result,
                    "status": "PLANNED"
                };
                viService.createVI(vi).then(function () {
                    localStorageService.set("virtualElements", []);
                    $scope.updateSpList();
                });

            });
        };
        $scope.deleteVIRequest = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + viReq;
            MqNaaSResourceService.remove(url).then(function (result) {
                //                    viService.createVI(vi);
                $scope.updateSpList();
                $scope.tableParams.reload();
            });
            viService.removeVI(viReq).then(function (result) {});
        };

        $scope.sendVIR = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
            viService.updateStatus(viReq, "Processing");
            MqNaaSResourceService.put(url).then(function (result) {
                console.log(result);
                $scope.resRoot = result; //empty
                //                    viService.updateStatus(viReq, "Processing");
                $rootScope.info = viReq + " created";
                var vi = {
                    "name": result,
                    "status": "Created"
                };
                $scope.virtNet = result;
                viNetService.createVI(vi).then(function () {
                    viService.updateStatus(viReq, "Created");
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + vi.name + "/IRootResourceProvider/";
                    MqNaaSResourceService.list(url).then(function (result) {
                        console.log(result);
                        var listRes = result.IRootResource.IRootResourceId;
                        listRes.forEach(function (entry) {
                            console.log(entry);
                            viNetService.addResourceToVI($scope.virtNet, entry, entry.split("-")[0]).then(function () {});
                        })
                    });
                    $rootScope.info = "200 - Virtual slice created";
                    $scope.updateSpList();
                });
            });
            /*                promise = $interval(function () {
             viService.updateStatus(viReq, "Created");
             $scope.updateSpList();
             $rootScope.info = " OK " + viReq + " Created, received 200 from IML";
             }, 4000);
             */
            viService.updateStatus(viReq, "Created");

            $rootScope.info = viReq + " created";
            $scope.updateSpList();
        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

    })
    .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $modal, viService, localStorageService, $interval) {
        console.log("Edit VI : " + $stateParams.id);
        var promise;
        $scope.updateVirtualElements = function () {
            viService.getVIByName($scope.viId).then(function (result) {
                console.log(result);
                localStorageService.set("virtualElements", result.viRes);
                $scope.virtualElements = result.viRes;
            });
        };
        $scope.updateVirtualElements();
        console.log(localStorageService.get("virtualElements"));
        $scope.viId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.mapPorts = false;
        $scope.mappedPorts = [];
        $scope.virtualElements = [];
        //            localStorageService.set("virtualElements", []);

        var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
        MqNaaSResourceService.get(urlPeriod).then(function (result) {
            if (result == null)
                return;
            $scope.period = result.period;
            $scope.period.startDate = parseInt($scope.period.startDate * 1000);
            $scope.period.endDate = parseInt($scope.period.endDate * 1000);
        });

        $scope.setPeriod = function (period) {
            var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
            var onPeriod = getPeriod(new Date(period.startDate).getTime() / 1000, new Date(period.endDate).getTime() / 1000); //xml
            MqNaaSResourceService.put(urlPeriod, onPeriod).then(function () { //the response is empty
            });
        };
        $scope.addResourceToVI = function (resourceType) { //resourceType TSON/ARN/CPE...
            console.log("ADD RESOURCE TO VI");
            resourceType = resourceType.toUpperCase();
            console.log(resourceType);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/?arg0=" + resourceType;
            MqNaaSResourceService.put(url).then(function (virtualResource) {
                $scope.resourceRequest = virtualResource;
                viService.addResourceToVI($scope.viId, virtualResource, resourceType).then(function () {
                    console.log("Added resource with name: " + virtualResource);
                    var vEl = localStorageService.get("virtualElements");
                    vEl.push({
                        name: virtualResource,
                        type: resourceType
                    });
                    localStorageService.set("virtualElements", vEl);
                    $scope.addResourceToGraph(virtualResource);
                    $scope.updateVirtualElements();
                    $scope.configureVirtualResource(virtualResource);
                });
            });
        };
        $scope.addVirtualPortToResource = function (resourceRequest) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceRequest + "/IPortManagement";
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.virtualPort.push(result);
            });
        };
        $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource) {
            console.log(resourceRequest);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.physicalPorts = $scope.getPhysicalPorts(realResource);
                $scope.virtualPorts = $scope.getVirtualPorts(resourceRequest);
                $scope.mapPorts = true;
            });
        };
        $scope.mapVirtualPorts = function (virtualPort, realPort) {
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
            viService.updateStatus(viReq, "Processing");
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                viService.updateStatus(viReq, "Processing");
                $rootScope.info = viReq + " created";
            });
            /*                promise = $interval(function () {
             viService.updateStatus(viReq, "Created");
             $scope.updateSpList();
             $rootScope.info = " OK " + viReq + " Created, received 200 from IML";
             }, 4000);
             */
            viService.updateStatus(viReq, "Created");
            $rootScope.info = viReq + " created";
        };
        $scope.addResourceToGraph = function (name) {
            console.log($scope.ngDialogData);
            console.log(name);
            createElement(name, $scope.ngDialogData.nodeType.toLowerCase(), $scope.ngDialogData.divPos);
        };

        $scope.getVirtualPorts = function (virtualRes) {
            console.log(virtualRes);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualRes + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.virtualPorts = result;
            });
        };
        $scope.getPhysicalPorts = function (resourceName) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result.IResource.IResourceId);
                $scope.physicalPorts = [];
                result.IResource.IResourceId.forEach(function (entry) {
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement/" + entry + "/IAttributeStore/attribute/?arg0=portInternalId";
                    MqNaaSResourceService.getText(url).then(function (realPort) {
                        var result = {
                            onP: entry,
                            real: realPort
                        };
                        console.log($scope.physicalPorts);
                        $scope.physicalPorts.push(result);
                    });
                });
            });
        };
        $scope.openMappingDialog = function (source, target) {
            console.log("FUNCTION IS CALLED");
            $scope.getListVirtualResources();
            $scope.getListRealResources();
            if (source === undefined || target === undefined) {
                $scope.getListVirtualResources();
                $scope.getListRealResources();
            } else if (source.indexOf("ARN") !== -1 || source.indexOf("CPE") !== -1 || source.indexOf("TSON") !== -1) {
                $scope.physicalPorts = $scope.getPhysicalPorts(source);
                $scope.virtualPorts = $scope.getVirtualPorts(target);
                $scope.viRes = target;
                $scope.piRes = source;
            } else {
                $scope.physicalPorts = $scope.getPhysicalPorts(target);
                $scope.virtualPorts = $scope.getVirtualPorts(source);
                $scope.viRes = source;
                $scope.piRes = target;
            }
            console.log($scope);
            $model({
                template: 'partials/createVI/mappingPortsDialog.html',
                scope: $scope
            });
        };

        $scope.getListVirtualResources = function () {
            viService.getVIByName($scope.viId).then(function (response) {
                $scope.virtualResources = response.viRes;
            });
        };
        $scope.getListRealResources = function () {
            $scope.physicalResources = localStorageService.get("networkElements");
        };

        //            $scope.physicalPorts = $scope.getPhysicalPorts("ARN-Internal-1.0-3");
        //            $scope.virtualPorts = $scope.getVirtualPorts("req-1");

        $scope.getMappingPort = function (virtualPort) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/mapping/?arg0=" + virtualPort;
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.virtualPorts = result;
            });
        };

        $scope.getSliceResource = function (virtResource) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/slice";
            MqNaaSResourceService.gut(url).then(function (result) {
                localStorageService.set("virtualSlices", result);
            });
        };

        $scope.createUnitRange = function (virtResource) {
            var range = getRangeUnit(1, 2);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitManagement";
            MqNaaSResourceService.put(url).then(function () {});
        };

        $scope.setRange = function (virtResource, sliceId, unitId, lowerRange, upRange) {
            var range = getRangeUnit(lowerRange, upRange);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
            MqNaaSResourceService.put(url, range).then(function () {});
            $scope.rangeSetOk = "Range set correctly";
        };

        $scope.setCube = function (virtResource) {
            var cube = getCubeforVirtualResource(2, 2);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
            MqNaaSResourceService.put(url, cube).then(function () {});
        };
        $scope.getSlice = function (resourceName) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/slice";
            console.log(url);
            MqNaaSResourceService.getText(url).then(function (data) {
                console.log(data);
                $scope.getSliceInfo = data;
                $scope.getListUnits(resourceName, data);
            });
        };
        $scope.getListUnits = function (resourceName, slice) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/" + slice + "/IUnitManagement";
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.getUnitsList = data.IResource.IResourceId;
            });
        };
        $scope.openSlicesDialog = function () {
            $scope.getListVirtualResources();
            $modal({
                template: 'partials/viResourceInfo.html',
                scope: $scope
            });
        };

        $scope.createUnit = function (virtResource, sliceId, unitType) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + $scope.getSliceInfo + "/IUnitManagement/?arg0=" + unitType;
            MqNaaSResourceService.put(url).then(function () {
                $scope.getListUnits(virtResource, $scope.getSliceInfo);
            });
        };

        $scope.getUnit = function (virtResource, slice, unitId) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response.unit);
                $scope.unitInfo = response.unit;
            });
        };

        $scope.attachPortsDialog = function (type, linkId, portId) {
            $scope.getLinks();
            ngDialog.open({
                template: 'partials/viResourceInfo.html',
                scope: $scope
            });
        };
        $scope.attachPortsToLink = function (type, linkId, portId) {
            var url;
            if (type === "source")
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/srcPort?arg0=" + portId;
            else if (type === "target")
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/" + linkId + "/ILinkAdministration/dstPort?arg0=" + portId;
            MqNaaSResourceService.put(url).then(function (response) {}); //empty
        };

        $scope.getLinks = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response.unit);
                $scope.links = response.unit;
            });
        };

        $scope.configureVirtualResource = function (virtResource) {
            console.log(virtResource);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (data) {
                var sliceId = data;
                var unitType = "port";
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement?arg0=" + unitType;
                MqNaaSResourceService.put(url).then(function (data) {
                    console.log("SET unit" + data);
                    var unitId = data;
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                    var range = getRangeUnit(1, 2);
                    MqNaaSResourceService.put(url, range).then(function () {

                        var unitType = "vlan";
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement?arg0=" + unitType;
                        MqNaaSResourceService.put(url).then(function (data) {
                            var unitId = data;
                            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId + "/IUnitAdministration/range";
                            var range = getRangeUnit(1, 2);
                            MqNaaSResourceService.put(url, range).then(function () {

                                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
                                var cubes = getCubeforTSON(1, 1, 2, 2);
                                MqNaaSResourceService.put(url, cubes).then(function () {});
                            });
                        });
                    });
                });


            });
        };
    });
