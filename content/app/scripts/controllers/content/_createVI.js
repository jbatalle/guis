'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
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
            if (object) name = object.name;
            var url = "viNetworks"
            var json = {
                "id": viReq,
                "name": name
            };
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
