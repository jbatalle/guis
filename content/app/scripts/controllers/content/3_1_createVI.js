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
    .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, $modal, localStorageService, IMLService) {
        console.log("EDIT VI CONTROLLER")
        $rootScope.viId = $stateParams.id;
        $rootScope.virtualPort = [];
        $rootScope.mapPorts = false;
        $rootScope.mappedPorts = [];
        $scope.virtualElements = [];

        $scope.openaddVIResDialog = function () {
            console.log("ADD RESOURCE VUI")
        }

        var url = "viReqNetworks/" + $scope.viId;
        IMLService.get(url).then(function (result) {
            if (result == null) return;
            $scope.period = result.period;
            if ($scope.period) {
                $scope.period.startDate = parseInt($scope.period.period_start * 1000);
                $scope.period.endDate = parseInt($scope.period.period_end * 1000);
            }
            $scope.virtualRequest = result;
            console.log($scope.virtualRequest);
            $scope.virtualElements = $scope.virtualRequest.vi_req_resources;
            localStorageService.set("virtualElements", $scope.virtualRequest);

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

        $scope.mappingDialog = function (source, dest) {
            $rootScope.createMappingDialogCall(source, dest, '');
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

        $rootScope.viewName = 'VI request: ' + $stateParams.id;

        console.log("Edit VI : " + $stateParams.id);
        $scope.viId = $stateParams.id;
        //$scope.virtualPort = [];
        $scope.mapPorts = false;
        $scope.mappedPorts = [];
        //$scope.virtualElements = [];
        localStorageService.set("virtualElements", []);
        var vEl = [];

        $scope.addResourceToVI = function (resourceType, divPos) { //resourceType TSON/ARN/CPE...
            console.log("ADD RESOURCE TO VI");
            resourceType = resourceType.toUpperCase();
            console.log(resourceType);

            var url = "/viReqNetworks/" + $scope.viId + "/viReqResource/addResource";
            var data = {
                "type": resourceType
            };
            IMLService.post(url, data).then(function (virtualResource) {
                $rootScope.resourceRequest = virtualResource;
                console.log(virtualResource);
                $scope.addResourceToGraph(virtualResource, resourceType, divPos);
                vEl.push({
                    name: virtualResource,
                    type: resourceType
                });
                localStorageService.set("virtualElements", vEl);
            });
        };

        $scope.addVirtualPortToResource = function (resourceRequest) {
            var url = "viReqNetworks/" + $scope.viId + "/viReqResource/" + resourceRequest + "/addPort";
            IMLService.post(url).then(function (result) {
                console.log(result)
                $rootScope.virtualPort.push(result);
                //$scope.getMappedResources();
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

        $scope.addResourceToGraph = function (name, type, divPos) {
            console.log(name);
            createElement(name, type, divPos);
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
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/createVI/mappingPortsDialog.html',
                show: true,
                scope: $scope
            });
        };
        $scope.openAutoMappingDialog = function (source, target) {
            if (source === undefined || target === undefined) {
                $scope.getListVirtualResources();
                $scope.getListRealResources();
            }
            console.log($scope);

            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/createVI/autoMappingPortsDialog.html',
                show: true,
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

    });
