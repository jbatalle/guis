'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
    .controller('listVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, ngTableParams, viService, localStorageService, $interval) {
        $rootScope.viewName = 'Virtual Infrastructure requests';
        $rootScope.networkId = "Network-2";
        var promise;
        $scope.data = [];
        $scope.updateSpList = function () {
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                //                    $scope.data = result.IResource.IResourceId;
                $scope.tableParams.reload();
            });
            viService.list().then(function (result) {
                console.log(result);
                $scope.data = result;
                $scope.tableParams.reload();
            });
        };
        $scope.updateSpList();
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 10, // count per page
            sorting: {
                date: 'desc' // initial sorting
            }
        }, {
            total: $scope.data.length,
            getData: function ($defer, params) {
                var data = checkIfIsArray($scope.data);
                var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

        $scope.createVIRequest = function () {
            var urlCreateVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.put(urlCreateVI).then(function (result) {
                //                    $scope.data.push(result);
                console.log("Update view");
                var vi = {
                    "name": result,
                    "status": "in edition"
                };
                viService.createVI(vi).then(function () {
                    localStorageService.set("virtualElements", []);
                    $scope.updateSpList();
                });
            });
        };
        $scope.deleteVIRequest = function (viReq) {
            console.log("Remove " + viReq);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + viReq;
            MqNaaSResourceService.remove(url).then(function (result) {
                //                    viService.createVI(vi);
                $scope.updateSpList();
                //                    $scope.tableParams.reload();
            });
            viService.removeVI(viReq).then(function (result) {});
        };

        $scope.sendVIR = function (viReq) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
            viService.updateStatus(viReq, "Processing");
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                viService.updateStatus(viReq, "Processing");
            });
            promise = $interval(function () {
                console.log("Processing");
                viService.updateStatus(viReq, "Created");
                $scope.updateSpList();
                $rootScope.info = " OK " + viReq + " Created, received 200 from IML";
            }, 2000);
            //                viService.updateStatus(viReq, "Created");

            $scope.updateSpList();
        };
        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
    })
    .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, ngDialog, viService, localStorageService) {
        $rootScope.viewName = 'VI request: ' + $routeParams.id;
        $scope.updateVirtualElements = function () {
            viService.getVIByName($scope.viId).then(function (result) {
                console.log("Update VirtualElements");
                console.log(result);
                localStorageService.set("virtualElements", result.viRes);
                console.log(result.viRes);
                $scope.virtualElements = result.viRes;
            });
        };

        $scope.updateVirtualElements();

        console.log("Edit VI : " + $routeParams.id);
        $scope.viId = $routeParams.id;
        $scope.virtualPort = [];
        $scope.mapPorts = false;
        $scope.mappedPorts = [];
        //$scope.virtualElements = [];
        localStorageService.set("virtualElements", []);
        // $scope.updateVirtualElements();
        //            console.log($scope.$parent.ngDialogData);

        var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
        MqNaaSResourceService.get(urlPeriod).then(function (result) {
            if (result !== null) {
                $scope.period = result.period;
                $scope.period.startDate = parseInt($scope.period.startDate * 1000);
                $scope.period.endDate = parseInt($scope.period.endDate * 1000);
            }
        });

        /*
            viService.getVIByName($scope.viId).then(function (result) {
                console.log(result);
                localStorageService.set("virtualElements", result.viRes);
            });*/

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
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resourceRequest = result;
                viService.addResourceToVI($scope.viId, result, resourceType).then(function (res) {
                    console.log("Added resource with name: " + res);
                    var vEl = localStorageService.get("virtualElements");
                    vEl.push({
                        name: result,
                        type: resourceType
                    });
                    localStorageService.set("virtualElements", vEl);
                    $scope.addResourceToGraph(result);
                    $scope.updateVirtualElements();
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
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.physicalPorts = $scope.getPhysicalPorts(realResource);
                $scope.virtualPorts = $scope.getVirtualPorts(resourceRequest);
                $scope.mapPorts = true;
            });
        };
        $scope.mapVirtualPorts = function (virtualPort, realPort) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + virtualPort + "&arg1=" + realPort;
            MqNaaSResourceService.put(url).then(function (result) {
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
                console.log(result);
                $scope.resRoot = result; //empty
                viService.updateStatus(viReq, "created");
                $rootScope.info = viReq + " created";
            });
            viService.updateStatus(viReq, "created");
            $rootScope.info = viReq + " created";
        };
        $scope.addResourceToGraph = function (name) {
            console.log($scope.ngDialogData);
            console.log(name);
            createElement(name, $scope.ngDialogData.nodeType.toLowerCase(), $scope.ngDialogData.divPos);
        };

        $scope.getVirtualPorts = function (virtualRes) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualRes + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                $scope.virtualPorts = result;
            });
        };
        $scope.getPhysicalPorts = function (resourceName) {
            console.log("Calling get Phyisical port " + resourceName);
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                $scope.physicalPorts = result;
            });
        };
        $scope.openMappingDialog = function (source, target) {
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
            ngDialog.open({
                template: 'partials/createVI/mappingPortsDialog.html',
                scope: $scope
            });
        };
        $scope.openAutoMappingDialog = function (source, target) {
            if (source === undefined || target === undefined) {
                $scope.getListVirtualResources();
                $scope.getListRealResources();
            }
            console.log($scope);

            ngDialog.open({
                template: 'partials/createVI/autoMappingPortsDialog.html',
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
        $scope.$watch('physicalPorts', function (newValue, oldValue) {
            console.log('physicalPorts changed to ' + newValue);
        });
        $scope.autoMapping = function (source, target) {
            console.log(source);
            console.log(target);
            if (source === undefined || target === undefined) {
                $scope.getListVirtualResources();
                $scope.getListRealResources();
            } else if (source.indexOf("ARN") !== -1 || source.indexOf("CPE") !== -1 || source.indexOf("Tson") !== -1) {
                $scope.physicalPorts = $scope.getPhysicalPorts(source);
                console.log($scope.physicalPorts);
                $scope.virtualPorts = $scope.getVirtualPorts(target);
            } else {
                console.log($scope.physicalPorts);
                $scope.physicalPorts = $scope.getPhysicalPorts(target);
                $scope.virtualPorts = $scope.getVirtualPorts(source);
            }
            //                $scope.mapVirtualPorts($scope.virtualPorts[0], $scope.physicalPorts[0]);
            $scope.coded = [{
                virt: "port-11",
                real: "port-1"
            }, {
                virt: "port-12",
                real: "port-2"
            }, {
                virt: "port-13",
                real: "port-3"
            }, ];
            console.log($scope.physicalPorts);
            console.log($scope.virtualPorts);
            console.log();
            //                mapVirtualPorts();
        };

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
                $scope.getUnitsList = checkIfIsArray(data.IResource.IResourceId);
            });
        };
        $scope.openSlicesDialog = function () {
            $scope.getListVirtualResources();
            ngDialog.open({
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
    })
    .controller('listVIMenuController', function ($scope, $rootScope, MqNaaSResourceService, $filter, ngTableParams, viService, localStorageService) {
        console.log("LIST VI");

        viService.list().then(function (result) {
            console.log(result);
            $scope.data = result;
        });
    });