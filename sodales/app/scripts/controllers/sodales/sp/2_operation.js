'use strict';

angular.module('mqnaasApp')
    .controller('spVIController', function ($scope, $rootScope, $stateParams, $http, $modal, MqNaaSResourceService, arnService, cpeService, AuthService, spService, MQNAAS) {

        //hardcoded
        //$rootScope.networkId = "Network-Internal-1.0-2";
        //$rootScope.virtNetId = "Network-virtual-7";
        var url = '';
        if ($stateParams.id) $rootScope.virtNetId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];

        $scope.operation = false;
        $rootScope.virtualResource = null;
        $scope.selectedNetwork;

        $scope.getNetworkResources = function () {
            url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider";
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

                        url = "IRootResourceProvider";
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
                            });
                        });
                    });
                });
            });
        };

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

        $scope.operationButton = function (resourceName, type) {
            //http://sodales:9000/mqnaas/IRootResourceAdministration/Network-Internal-1.0-2/IRequestBasedNetworkManagement/Network-virtual-5/IRootResourceProvider/CPE-Internal-1.0-6/IResourceModelReader/resourceModel
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement/' + $rootScope.virtNetId + '/IRootResourceProvider/' + resourceName + '/IResourceModelReader/resourceModel/';
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceUri = data.resource.descriptor.endpoints.endpoint.uri.replace("http://0.0.0.0", MQNAAS);
                console.log($rootScope.resourceUri);
                //$rootScope.resourceUri.replace("http://0.0.0.0", MQNAAS)
                console.log($rootScope.resourceUri);
                $scope.operation = true;
                if (type === 'ARN') {
                    $scope.arnOperation = true;
                    $scope.cpeOperation = false;
                    $scope.openOperationARNDialog(resourceName, type);
                } else if (type === 'CPE') {
                    $scope.arnOperation = false;
                    $scope.cpeOperation = true;
                    $scope.openOperationCPEDialog(resourceName, type);

                }
            })
        };

        $scope.openOperationARNDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.arn = new Object;
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
        };

        $scope.openOperationCPEDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.cpe = new Object;

            $scope.cpeServices = [];
            url = "serviceMapping.xml?unit=0";
            cpeService.get(url).then(function (response) {
                var serviceList = checkIfIsArray(response.meaServiceMap.ServiceMapping);
                angular.forEach(serviceList, function (service) {
                    url = "serviceVlanDetail.xml?unit=0&serviceId=" + service.serviceId;
                    cpeService.get(url).then(function (response) {
                        //response.meaGetServiceVlanId.serviceDataBase.id = police.profileId;
                        $scope.cpeServices.push(response.meaGetServiceVlanId.serviceDataBase);
                    });
                })

                //inside beacuse the response time of the CPE
                $scope.cpePolices = [];
                url = "policerAllProfiles.xml?unit=0";
                cpeService.get(url).then(function (response) {
                    var policeList = checkIfIsArray(response.meaPolicerAllProfiles.policerProfId);
                    angular.forEach(policeList, function (police) {
                        url = "policerProfile.xml?unit=0&profileId=" + police.profileId;
                        cpeService.get(url).then(function (response) {
                            response.meaPolicerProfile.PolicerData.id = police.profileId;
                            $scope.cpePolices.push(response.meaPolicerProfile.PolicerData);
                        });
                    })
                });
            });
        };

        $scope.getCpeService = function (serviceId) {
            url = "serviceVlanDetail.xml?unit=0&serviceId=" + serviceId;
            cpeService.get(url).then(function (response) {
                $scope.cpeService = response.meaServiceMap;
            });
        };
        $scope.getCpePolice = function (profileId) {
            url = "policerAllProfiles.xml?unit=0&serviceId=" + profileId;
            cpeService.get(url).then(function (response) {
                console.log(response);
                $scope.cpePolice = response.meaPolicerAllProfiles.policerProfId;
            });
        };

        $scope.lag = {};
        $scope.ns = {};
        $scope.cs = {};

        $scope.createLAG = function (lag) {
            console.log(lag);
            console.log($scope.listPorts);
            arnService.put(getCardInterfaces(0)).then(function (response) {
                var interfaces = response.response.operation.interfaceList.interface;
                interfaces.every(function (iface) {
                    console.log(iface);
                    if (iface.lag !== undefined) return true;
                    else {
                        lag.interfaceId = iface._interfaceId;
                        lag.attachedPorts = "";
                        angular.forEach($scope.listPorts, function (port) {
                            attachedPorts += attachPortsToLag(lag.interfaceId, port.attributes.entry[0].value)
                        });

                        arnService.put(createLAG(0, lag.interfaceId, lag.loadBalance.id, attachedPorts, lag.description)).then(function (response) {});
                        return false;
                    }
                });
            });
        };

        $scope.activateLag = function (data) {
            var interfaceId = data._interfaceId;
            var admin = 0;
            if (data._admin === '1') admin = 2;
            else if (data._admin === '2') admin = 1;
            arnService.put(changeStatusLAG(interfaceId, admin)).then(function (response) {
                console.log(response);
            });
        };

        $scope.createNetworkService = function (ns) {
            console.log(ns);
            console.log(ns);
            return;
            arnService.put(createNetworkService(id, 2, ns.name, ns.type.id, ns.uplinkVlanId, ns.uniVlanId)).then(function (response) {
                console.log(response);
                arnService.put(addPortsToNetworkService(id, cardId, interfaceId, 1)).then(function (response) {});
            });
        };

        $scope.activateNetworkService = function (data) {
            var interfaceId = data._id;
            var admin = 0;
            if (data._admin === '1') admin = 2;
            else if (data._admin === '2') admin = 1;
            arnService.put(changeStatusNetworkService(id, admin)).then(function (response) {
                console.log(response);
            });
        };

        $scope.createClientService = function (cs) {
            console.log(cs);
            return;
            arnService.put(createClientService(networkServiceId, 2, cs.name, cs.uniVlanId)).then(function (response) {
                console.log(response);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.activateClientService = function (data) {
            var interfaceId = data._id;
            var admin = 0;
            if (data._admin === '1') admin = 2;
            else if (data._admin === '2') admin = 1;
            arnService.put(changeStatusClientService(id, admin)).then(function (response) {
                console.log(response);
            });
        };

        $scope.openModal = function (mode) {
            var template, label;
            if (mode === 'createLAG') {
                template = 'views/modals/operation/createLAG.html';
                label = "Create LAG";
            } else if (mode === 'createNS') {
                template = 'views/modals/operation/createNS.html';
                label = "Create Network Service";
            } else if (mode === 'createCS') {
                template = 'views/modals/operation/createCS.html';
                label = "Create Client Service";
            } else if (mode === 'createService') {
                template = 'views/modals/operation/createCpeService.html';
                label = "Create service";
            } else if (mode === 'createPolice') {
                template = 'views/modals/operation/createCpePolice.html';
                label = "Create Police";
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
                var ports = $rootScope.virtualResource.ports
                return ports.filter(function (port) {
                    return port.id.toLowerCase().indexOf(query.toLowerCase()) != -1;
                });
            });
        };

        $scope.arnOperation_tabs = [{
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

        $scope.cpeOperation_tabs = [{
                title: 'Services',
                url: 'tab_service'
        },
            {
                title: 'Polices',
                url: 'tab_police'
        }
       ];

        $scope.arnOperation_tabs.activeTab = 'tab_lag';
        $scope.cpeOperation_tabs.activeTab = 'tab_service';

        $scope.onClickTab = function (tab) {
            $scope.currentTab = tab.url;
        };

        $scope.deleteDialog = function (obj, type) {
            $scope.itemToDelete = obj;
            $scope.itemType = type;
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/modals/operation/modalOperationRemove.html',
                show: true,
                scope: $scope
            });
        };

        $scope.deleteItem = function (obj, type) {
            console.log(obj);
            if (type === 'LAG') {
                var deattachPorts = "";
                if (obj.lag.lagMemberList) {
                    angular.forEach(checkIfIsArray(obj.lag.lagMemberList), function (d) {
                        console.log(d);
                        deattachPorts += detachLagPort(d.lagMember._interfaceId, d.lagMember._interfaceId);
                    });
                }

                arnService.put(removeLag(obj._interfaceId, obj._cardId, deattachPorts)).then(function (response) {
                    console.log(response);
                });
            } else if (type === 'NS') {
                arnService.put(removeNetworkService(obj._id)).then(function (response) {
                    console.log(response);
                });
            } else if (type === 'CS') {
                arnService.put(removeClientService(obj._id, obj.interfaceList_ref.interface_ref._cardId)).then(function (response) {
                    console.log(response);
                });
            }
            this.$hide();
        };

        $scope.createCpePolice = function (profile) {
            url = "policerProfile.html?unit=0&profileId=3&CIR=" + profile.CIR + "&EIR=" + profile.EIR + "&CBS=" + profile.CBS + "&EBS=" + profile.EBS + "&gn_type=2";
            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });
        };

        $scope.createCpeService = function (cpeSvc) {
            var clusterId = cpeSvc.dstPort;
            url = "createServiceVlan.html?unit=0&serviceId=6&srcPort=" + cpeSvc.srcPort + "&policerId=" + cpeSvc.police.id + "&pmId=3&eIngressType=1&outer_vlanId=" + cpeSvc.innerVlan + "&clusterId=" + clusterId + "&vlanEdit_flowtype=2&vlanEdit_outer_command=3&vlanEdit_outer_vlan=" + cpeSvc.outerVlan;
            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });

            url = "ingress_port_setting.html?unit=0&port_id=" + clusterId + "&rx_enable=1&crc_check=1&my_mac=00:01:03:05:06:05";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + clusterId + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + cpeSvc.srcPort + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "ccmSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=10&srcPort=104&megLevel=4&cfmVersion=0&ccmPeriod=1&rdiEnable=1&megId=ccmTest&lmEnable=1&remoteMepId=10&localMepId=9&policerId=3&outServiceId=6&inServiceId=7&Priority=7";
            cpeService.post(url).then(function (response) {});

        };

        $scope.deleteCpeService = function (serviceId) {
            url = "deleteServiceVlan.html?unit=0&serviceId=" + serviceId;
            cpeService.get(url).then(function (response) {});
        };

        $scope.deleteCpePolice = function (serviceId) {
            //url = "deleteServiceVlan.html?unit=0&serviceId=" + serviceId;
            //cpeService.post(url).then(function (response) {});
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
    });
