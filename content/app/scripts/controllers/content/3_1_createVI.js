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
    .controller('editVIController', function ($scope, $rootScope, $stateParams, $modal, localStorageService, IMLService) {
        console.log("EDIT VI CONTROLLER")
        $rootScope.viId = $stateParams.id;
        $rootScope.virtualPort = [];
        $rootScope.mapPorts = false;
        $rootScope.mappedPorts = [];
        $scope.virtualElements = [];
        $rootScope.viewName = 'VI request: ' + $stateParams.id;

        $scope.openaddVIResDialog = function (t) {
            console.log("ADD RESOURCE VI");
            console.log(t);
        }

        $scope.openaddVIResDialog = function (nodeType, divPos) {
            console.log("MODAL");
            $rootScope.resourceRequest = undefined;
            $rootScope.virtualPort = [];
            $scope.nodeType = nodeType;
            $scope.divPos = divPos;
            $modal({
                title: 'Are you sure you want to add this item?',
                template: 'views/content/addResInVIDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.updateListOfVirtualResoruces = function () {
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
        };

        $scope.updateListOfVirtualResoruces();

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

        console.log("Edit VI : " + $stateParams.id);
        $scope.viId = $stateParams.id;
        //$scope.virtualPort = [];
        $scope.mapPorts = false;
        $scope.mappedPorts = [];
        //$scope.virtualElements = [];
        //localStorageService.set("virtualElements", []);
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
                $scope.updateListOfVirtualResoruces();

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

        $scope.addResourceToGraph = function (name, type, divPos) {
            console.log(name);
            //createElement(nodes[i].id, nodes[i].type, divPos, data);
            createElement(name, type.toLowerCase(), divPos);
        };

        $scope.getPhysicalPorts = function (resourceName) {
            console.log("Calling get Phyisical port " + resourceName);
        };

        $scope.openMappingDialog = function (source, target) {
            console.log(source); //id
            console.log(target);
            //if tpyes are diferent
            $scope.getListVirtualResources();
            //$scope.getListRealResources();
            if (source === undefined || target === undefined) {
                //$scope.getListVirtualResources();
                $scope.getListRealResources();
            } else if (source.indexOf("ARN") !== -1 || source.indexOf("CPE") !== -1 || source.indexOf("TSON") !== -1 || source.indexOf("EPC") !== -1 || source.indexOf("LTE") !== -1 || source.indexOf("WNODE") !== -1) {
                $scope.physicalPorts = $scope.getPhysicalPorts(source);
                $scope.virtualPorts = $scope.getVirtualPorts(target);
                $scope.viRes = target;
                $scope.piRes = source;
            } else {
                //$scope.physicalPorts = $scope.getPhysicalPorts(target);
                //$scope.virtualPorts = $scope.getVirtualPorts(source);
                $scope.viRes = source;
                $scope.piRes = target;
            }

            console.log($scope.virtualElements);
            console.log($scope.physicalResources);

            if (typeof $scope.virtualElements === 'string') {
                $scope.virtualElements = JSON.parse($scope.virtualElements);

            }

            var virtRes = $scope.virtualElements.filter(function (r) {
                if (r.id === source) return r;
            })[0];
            var phyRes = resources.resources.filter(function (r) {
                if (r.id === target) return r;
            })[0];

            console.log(virtRes);
            console.log(phyRes);

            if (virtRes.type !== phyRes.type) {
                console.log("The types are not equal.");
            }

            if (virtRes.type === "TSON") {
                //lambda -> timeslots
                $scope.mappedElementName = "Lambdas"
            } else if (virtRes.type === "EPC") {

            } else if (virtRes.type === "LTE") {

            }


            if (virtRes.type === "WNODE") {
                //mapp without ports either vlans
                $scope.mappedElementName = "Resource";
                $scope.virtMapRes = virtRes;
                $scope.phyMapRes = phyRes;
                $modal({
                    title: 'Mapping resources',
                    template: 'views/content/createVI/mappingResourceDialog.html',
                    show: true,
                    scope: $scope
                });
            } else {
                console.log($scope);
                $modal({
                    title: 'Mapping resources',
                    template: 'views/content/createVI/mappingPortsDialog.html',
                    show: true,
                    scope: $scope
                });
            }
        };
        $scope.openAutoMappingDialog = function (source, target) {
            if (source === undefined || target === undefined) {
                // $scope.getListVirtualResources();
                //$scope.getListRealResources();
            }
            console.log($scope);

            $modal({
                title: 'Are you sure you want to map these items?',
                template: 'views/content/createVI/autoMappingPortsDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.getListVirtualResources = function () {
            var url = "viReqNetworks/" + $scope.viId;
            IMLService.get(url).then(function (result) {
                if (result == null) return;
                $scope.virtualElements = $scope.virtualRequest.vi_req_resources;
            });
        };

        $scope.getListRealResources = function () {
            //$scope.physicalResources = localStorageService.get("networkElements");
            $scope.physicalResources = resources.resources;
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

            console.log($scope.physicalPorts);
            console.log($scope.virtualPorts);
            console.log();
            //                mapVirtualPorts();
        };

        $scope.getMappingPort = function (virtualPort) {

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
                }
                $scope.getMappedResources();
            });
            this.$hide();
        };

    })
    .controller('mappingCtrl', function ($rootScope, $scope, IMLService) {

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
            console.log(ports);
            console.log($scope.mapping);
            console.log($scope.mappingVlan);


            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + physicalResource + '/IResourceModelReader/resourceModel/';
            /* MqNaaSResourceService.get(url).then(function (result) {
                    console.log(result);
                    console.log(result.resource.descriptor.endpoints.endpoint);
                    var endpoint = result.resource.descriptor.endpoints.endpoint.uri;
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
                            var url = "viReqNetworks/" + $rootScope.viId + "/viReqResource/" + virtualResource + "/mapPort/" + port.virt + "/" + port.phy;
                            IMLService.post(url, "").then(function (response) {
                                console.log(response);
                            });
                        })

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
                        });
                    });
            });*/


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
