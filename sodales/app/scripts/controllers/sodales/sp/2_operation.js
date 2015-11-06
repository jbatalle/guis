'use strict';

angular.module('mqnaasApp')
    .controller('spVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, localStorageService, $modal, arnService, $http, AuthService, spService) {

        //hardcoded
        //$rootScope.networkId = "Network-Internal-1.0-2";
        //$rootScope.virtNetId = "Network-virtual-7";

        $rootScope.virtNetId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];

        $scope.operation = false;
        $rootScope.virtualResource = null;
        $scope.selectedNetwork;


        $scope.getNetworkResources = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider";
            MqNaaSResourceService.get(url).then(function (result) {
                $scope.networkRes = result.IRootResource.IRootResourceId;
            });
        };

        if ($rootScope.networkId && $rootScope.virtNetId) {
            $scope.getNetworkResources();
        } else {
            console.log("create list of vi nets");
            AuthService.profile().then(function (data) {
                spService.get(data.sp_id).then(function (data) {
                    $scope.networks = data.vis;
                    data.vis.forEach(function (viNet) {

                        var url = "IRootResourceProvider";
                        MqNaaSResourceService.list(url).then(function (result) {
                            var physicalNetworks = checkIfIsArray(result.IRootResource.IRootResourceId);

                            physicalNetworks.forEach(function (phyNet) {
                                if (phyNet === 'MQNaaS-1') return;
                                var urlVirtNets = 'IRootResourceAdministration/' + phyNet + '/IRequestBasedNetworkManagement/' + viNet.name + '/IResourceModelReader/resourceModel';
                                MqNaaSResourceService.list(urlVirtNets).then(function (viInfo) {
                                    if (!viInfo) return;
                                    $rootScope.networkCollection.push({
                                        id: viNet.name,
                                        physicalNetwork: phyNet,
                                        created_at: viInfo.resource.attributes.entry.value
                                    });
                                });
                            })
                        });
                    });
                });
            });
        }

        $scope.setVirtualNetwork = function () {
            $rootScope.virtNetId = $scope.selectedNetwork.id;
            $rootScope.networkId = $scope.selectedNetwork.physicalNetwork;
            $scope.getNetworkResources();
        };


        $scope.createOperation = function () {
            $modal({
                template: 'partials/sodales/sp/arnOpDialog.html',
                scope: $scope
            });
        };

        $scope.openOperationARNDialog = function (resourceName, type) {
            $scope.operation = true;
            console.log("Dialog call");
            $scope.virtualResourceOp = resourceName;
            $scope.arn = new Object;

            //getLAGList
            arnService.put(getCardInterfaces(0)).then(function (response) {
                $scope.LAGs = response.response.operation.interfaceList.interface;
            });

            arnService.put(getNetworkServices()).then(function (response) {
                console.log(response);
                $scope.networkServices = response.response.operation.networkServiceList.networkService;
            });

            arnService.put(getClientServices()).then(function (response) {
                console.log(response);
                $scope.clientServices = response.response.operation.clientServiceList.clientService;
            });

            //getNetworkService

        };

        $scope.lag = {};
        $scope.ns = {};
        $scope.cs = {};
        $scope.createLAG = function (lag) {
            console.log(lag);
            console.log($scope.listPorts);
            return;
            arnService.put(createLAG(cardId, interfaceId, lagIfIndex, ethIfIndex, lag.description)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.activeLAG = function (interfaceId) {
            arnService.put(activeLAG(interfaceId)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.createNetworkService = function (ns) {
            console.log(ns);
            console.log(ns);
            return;
            arnService.put(createNetworkService(id, admin, name, uplinkVlanId, uniVlanId)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.createClientService = function (cs) {
            console.log(cs);
            return;
            arnService.put(createClientService(networkServiceId, admin, name, uniVlan)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.openModal = function (mode) {
            var template, label;
            if (mode === 'createLAG') {
                template = 'views/sodales/operation/createLAG.html';
                label = "Create LAG";
            } else if (mode === 'createNS') {
                template = 'views/sodales/operation/createNS.html';
                label = "Create Network Service";
            } else if (mode === 'createCS') {
                template = 'views/sodales/operation/createCS.html';
                label = "Create Client Service";
            }
            $modal({
                template: template,
                scope: $scope,
                title: label,
            });
        };

        $scope.lag_load_balances = [{
            id: 1,
            name: "Source MAC"
        }, {
            id: 2,
            name: "Destination MAC"
        }, {
            id: 3,
            name: "Destination and source MAC"
        }];
        $scope.lag_modes = [{
            id: 1,
            name: "Static"
        }, {
            id: 2,
            name: "Dynamic (LACP)"
        }];

        $scope.service_types = [{
            id: 1,
            name: "Unicast"
        }, {
            id: 2,
            name: "Multicast"
        }, {
            id: 3,
            name: "Univoip"
        }, {
            id: 4,
            name: "Bitstream"
        }, {
            id: 5,
            name: "MAC Bridge"
        }];

        $scope.listPorts = [];
        $scope.loadNodes = function (query) {
            return $http.get('', {
                cache: true
            }).then(function () {
                var ports = $scope.virtualResource.ports
                return ports.filter(function (port) {
                    return port.id.toLowerCase().indexOf(query.toLowerCase()) != -1;
                });
            });
        };

        $scope.openOperationCPEDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.cpe = new Object;
            $modal({
                template: 'partials/sodales/sp/cpeOpDialog.html',
                scope: $scope
            });
        };

        $scope.Configure = function (type, form) {
            console.log(type);
            if (type === "arn") {
                console.log(form);
                var arn = form;
                var data = getARNVlanConnectivity(arn.upLinkIfaces1, arn.upLinkIfaces2, arn.downLinkIfaces1, arn.downLinkIfaces2, arn.upLinkVlan, arn.downLinkVlan);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});

            } else if (type === "cpe") {
                console.log(form);
                var cpe = form;
                var data = getCPEVlanConnectivity(cpe.egressPortId, cpe.egressVlan, cpe.ingressPortId, cpe.ingressVlan, cpe.unitId);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});
            }
            $rootScope.info = "200 - Operation done";
            this.$hide();
        };


        $scope.operation_tabs = [{
                title: 'LAG',
                url: 'tab_lag'
        },
            {
                title: 'Network Service',
                url: 'tab_ns'
        },
            {
                title: 'Client Service',
                url: 'tab_cs'
        }
       ];

        $scope.operation_tabs.activeTab = 'tab_lag';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

    });
