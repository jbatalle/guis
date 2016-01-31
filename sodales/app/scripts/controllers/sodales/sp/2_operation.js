'use strict';

angular.module('mqnaasApp')
    .controller('spVIController', function ($scope, $rootScope, $stateParams, $http, $modal, arnService, cpeService, AuthService, spService, IMLService) {

        var url = '';
        if ($stateParams.id) $rootScope.virtNetId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];

        $scope.operation = false;
        $rootScope.virtualResource = null;
        //$scope.selectedNetwork;

        $scope.getNetworkResources = function () {
            url = 'viNetworks/' + $rootScope.virtNetId;
            IMLService.get(url).then(function (result) {
                $scope.networkRes = result;
            });
        };

        if ($rootScope.virtNetId) {
            $scope.getNetworkResources();
        } else {
            console.log("create list of vi nets");
            AuthService.profile().then(function (data) {
                spService.get(data.sp_id).then(function (data) {
                    $scope.networks = data.vis;
                    data.vis.forEach(function (viNet) {
                        var url = 'viNetworks';
                        IMLService.get(url).then(function (result) {
                            if (!result) return;
                            $rootScope.networkCollection.push(result);
                        });
                    });
                });
            });
        };

        $scope.setVirtualNetwork = function () {
            console.log($scope.selectedNetwork);
            $rootScope.virtNetId = $scope.selectedNetwork;
            $rootScope.networkId = $scope.selectedNetwork.physicalNetwork;
            $scope.getNetworkResources();
        };

        $rootScope.operationButton = function (resourceName, type) {
            console.log("Operation");
            $scope.operationResource = {
                name: resourceName,
                type: type
            };
            url = 'viNetworks/' + $rootScope.virtNetId + '/resource/' + resourceName;
            IMLService.get(url).then(function (data) {
                $rootScope.resourceUri = data.endpoint;
                console.log($rootScope.resourceUri);
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
            });
        };

        $rootScope.createEndToEnd2 = function (source, dest) {
            console.log("Create end to end connectivity");

            console.log(source);
            $scope.source = source;
            $scope.dest = dest;
            if (source.type === "CPE") {

            }

            if (source.type === "ARN") {

            }

            $modal({
                title: 'End to end connectivity',
                template: 'views/sodales/sp/endToEndDialog.html',
                show: true,
                scope: $scope
            });
        };

        $rootScope.createEndToEnd = function (source, dest) {
            console.log("Create end to end connectivity");

            console.log(source);
            $scope.source = source;
            $scope.dest = dest;

            //get resource info
            var url = 'viNetworks/' + $rootScope.virtNetId + '/resource/' + source.label;
            IMLService.get(url).then(function (data) {
                console.log(data);
                $scope.sourceResource = data;
            });

            url = 'viNetworks/' + $rootScope.virtNetId + '/resource/' + dest.label;
            IMLService.get(url).then(function (data) {
                console.log(data);
                $scope.destResource = data;
            });

            if (source.type === "CPE") {}

            if (source.type === "ARN") {

            }

            $scope.sourceCPESvc = {};
            $scope.destCPESvc = {};

            $modal({
                title: 'End to end connectivity',
                template: 'views/sodales/sp/endToEndDialog.html',
                show: true,
                scope: $scope
            });
        };

        $scope.openOperationARNDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.arn = new Object;
            arnService.put(getCardInterfaces(0)).then(function (response) {
                $scope.LAGs = response.response.operation.interfaceList.interface;
            });

            arnService.put(getNetworkServices()).then(function (response) {
                console.log(response);
                $scope.networkServices = checkIfIsArray(response.response.operation.networkServiceList.networkService);
            });

            arnService.put(getClientServices()).then(function (response) {
                console.log(response);
                $scope.clientServices = checkIfIsArray(response.response.operation.clientServiceList.clientService);
            });

            $scope.interfaces = [];
            $scope.cards = [];
            arnService.put(getAllInterfaces()).then(function (response) {
                $scope.interfaces = response.response.operation.interfaceList.interface;
            });

            arnService.put(getCards()).then(function (response) {
                console.log(response);
                $scope.cards = response.response.operation.cardList.card;
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

        $scope.createNetworkService = function (ns, listPorts) {
            console.log(ns);
            console.log(listPorts)

            $scope.interfaces.filter(function (d) {
                console.log(d);
                return d._id === listPorts
            });
            var id = "1"
            console.log(ns.interfaces);
            arnService.put(createNetworkService(2, ns.name, ns.serviceType.id, ns.uplinkVlanId, ns.uniVlanId)).then(function (response) {
                console.log(response);
                angular.forEach(listPorts, function (port) {
                    var equipment = $scope.interfaces.filter(function (d) {
                        console.log(d);
                        return d._interfaceId === port.physical
                    })[0];
                    var iface = $scope.interfaces.filter(function (d) {
                        console.log(d);
                        return (d._name === "intEth 1" && d._cardId === equipment._cardId)
                    })[0];
                    if (response.response.operation.result.error) {
                        console.log("Error creating the network service.");
                        $scope.errorMessage = response.response.operation.result.errorStr;
                    }
                    arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, equipment._cardId, iface._interfaceId, 2)).then(function (response) {});
                });
                arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, 0, 8781824, 2)).then(function (response) {});
                /*arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, $scope.cards[3].id, $scope.cards[3].interface, 2)).then(function (response) {});
                arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, $scope.cards[4].id, $scope.cards[4].interface, 2)).then(function (response) {});*/
            });
        };

        $scope.activateNetworkService = function (data) {
            var id = 2;
            var interfaceId = data._id;
            var admin = 0;
            if (data._admin === '1') admin = 2;
            else if (data._admin === '2') admin = 1;
            arnService.put(changeStatusNetworkService(id, admin)).then(function (response) {
                console.log(response.response.operation.result);
            });
        };

        $scope.createClientService = function (cs) {
            console.log(cs);
            //return;
            //networkServiceId, admin, name, uniVlan
            arnService.put(createClientService(cs.ns._id, 2, cs.name, cs.uniVlanId)).then(function (response) {
                console.log(response.response.operation.result);
                //$scope.LAGs = response.response.operation.interfaceList.interface;
            });
        };

        $scope.activateClientService = function (data) {
            var interfaceId = data._id;
            var admin = 0;
            if (data._admin === '1') admin = 2;
            else if (data._admin === '2') admin = 1;
            arnService.put(changeStatusClientService(id, admin)).then(function (response) {
                console.log(response.response.operation.result);
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
                $scope.eIngressTypes = eIngressType;
                $scope.vlanEdit_flowtypes = vlanEdit_flowtype;
                $scope.vlanEdit_flowtype_outers = vlanEdit_outer_command;
                template = 'views/modals/operation/createCpeService.html';
                label = "Create service";
            } else if (mode === 'createCFMService') {
                template = 'views/modals/operation/createCpeCFMService.html';
                label = "Create CFM service";
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
                var ports = $rootScope.virtualResource.ports;
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

        $scope.editDialog = function (obj, type) {
            $scope.itemToDelete = obj;
            $scope.itemType = type;

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
                var interfaceList = "";
                if (obj.interfaceList_ref !== "") interfaceList = obj.interfaceList_ref.interface_ref._cardId;
                arnService.put(removeClientService(obj._id, interfaceList)).then(function (response) {
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

        $scope.createCpeService = function (cpeSvc, type) {
            console.log(cpeSvc);
            cpeSvc.type = type;
            var possibleId = Math.floor((Math.random() * 200) + 1);
            var serviceId = null;
            //var inServiceId = null;
            var outServiceId = null;
            while (serviceId === null) {
                //find should replace filter?
                /*var l = $scope.cpeServices.filter(function (d) {
                    return d.serviceId === "2"
                });*/
                //if (l.length > 0) serviceId = possibleId;
                //else 
                possibleId = Math.floor((Math.random() * 200) + 1);
                serviceId = possibleId;
                outServiceId = serviceId + 1
            }

            if (cpeSvc.type !== "CFM") {
                cpeSvc.vlanEdit_flowtype_out = cpeSvc.vlanEdit_flowtype_outer;
                cpeSvc.vlanEdit_flowtype_outer_out = cpeSvc.vlanEdit_flowtype;
            } else {
                cpeSvc.vlanEdit_flowtype_out = cpeSvc.vlanEdit_flowtype;
                cpeSvc.vlanEdit_flowtype_outer_out = cpeSvc.vlanEdit_flowtype_outer;
            }

            console.log(serviceId);
            var clusterId = cpeSvc.dstPort.physical;
            url = "createServiceVlan.html?unit=0&serviceId=" + serviceId + "&srcPort=" + cpeSvc.srcPort.physical + "&policerId=" + cpeSvc.police.id + "&pmId=3&eIngressType=" + cpeSvc.eIngressType + "&outer_vlanId=" + cpeSvc.innerVlan + "&clusterId=" + clusterId + "&vlanEdit_flowtype=" + cpeSvc.vlanEdit_flowtype + "&vlanEdit_outer_command=" + cpeSvc.vlanEdit_flowtype_outer + "&vlanEdit_outer_vlan=" + cpeSvc.outerVlan;
            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });
            url = "createServiceVlan.html?unit=0&serviceId=" + outServiceId + "&srcPort=" + clusterId + "&policerId=" + cpeSvc.police.id + "&pmId=3&eIngressType=" + cpeSvc.eIngressType_outer + "&outer_vlanId=" + cpeSvc.outerVlan + "&clusterId=" + cpeSvc.srcPort.physical + "&vlanEdit_flowtype=" + cpeSvc.vlanEdit_flowtype_out + "&vlanEdit_outer_command=" + cpeSvc.vlanEdit_flowtype_outer_out + "&vlanEdit_outer_vlan=" + cpeSvc.innerVlan;
            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });

            url = "ingress_port_setting.html?unit=0&port_id=" + clusterId + "&rx_enable=1&crc_check=1&my_mac=00:01:03:05:06:05";
            cpeService.post(url).then(function (response) {});

            url = "ingress_port_setting.html?unit=0&port_id=" + cpeSvc.srcPort.physical + "&rx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + clusterId + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + cpeSvc.srcPort.physical + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});


            if (cpeSvc.type === "CFM") {
                url = "ccmSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=" + cpeSvc.innerVlan + "0&srcPort=" + cpeSvc.srcPort + "&megLevel=4&cfmVersion=0&ccmPeriod=1&rdiEnable=1&megId=ccmTest&lmEnable=1&remoteMepId=10&localMepId=9&policerId=" + policerId + "&outServiceId=" + outService + "&inServiceId=" + inService + "&Priority=7";
                cpeService.post(url).then(function (response) {});
            }

        };

        $scope.createEndToEndOperation = function (sourceCPE, targetCPE) {
            console.log(sourceCPE);
            console.log(targetCPE);

            if (false) {
                //CFM Traffic
                var cpeInfo = {
                    srcPort: sourceCPE.srcPort,
                    dstPort: sourceCPE.dstPort,
                    police: {
                        id: 3
                    },
                    eIngressType: 1,
                    eIngressType_outer: 1,
                    vlanEdit_flowtype: 2,
                    vlanEdit_flowtype_outer: 3,
                    innerVlan: sourceCPE.vlanEdit_flowtype_outer,
                    outerVlan: sourceCPE.vlanEdit_flowtype_outer
                };
                //$scope.createCFMService();
            }

            //configure source CPE
            var cpeSourceInfo = {
                srcPort: sourceCPE.srcPort,
                dstPort: sourceCPE.dstPort,
                vlanEdit_flowtype_outer: 2,
                police: {
                    id: 3
                },
                eIngressType: 1,
                eIngressType_outer: 0,
                innerVlan: sourceCPE.vlanEdit_flowtype_outer,
                vlanEdit_flowtype: 1,
                outerVlan: 0
            };
            console.log(cpeSourceInfo);
            $scope.createCpeService(cpeSourceInfo);

            var cpeTargetInfo = {
                srcPort: targetCPE.srcPort,
                dstPort: targetCPE.dstPort,
                vlanEdit_flowtype_outer: 2,
                police: {
                    id: 3
                },
                eIngressType: 1,
                eIngressType_outer: 0,
                innerVlan: targetCPE.vlanEdit_flowtype_outer,
                vlanEdit_flowtype: 1,
                outerVlan: 0
            };
            console.log(cpeTargetInfo);
            $scope.createCpeService(cpeTargetInfo);

            //configure last CPE
            //configure ARNs

            var ns = {
                name: "end-to-end-" + Math.floor((Math.random() * 200) + 1),
                serviceType: {
                    id: 2
                },
                uplinkVlanId: 6,
                uniVlanId: 6
            }
            var listPorts = [{
                physical: 8781824
            }, {
                physical: 50397184
            }, {
                physical: 67174400
            }];

            arnService.put(createNetworkService(2, ns.name, ns.serviceType.id, ns.uplinkVlanId, ns.uniVlanId)).then(function (response) {
                console.log(response);
                angular.forEach(listPorts, function (port) {
                    var equipment = $scope.interfaces.filter(function (d) {
                        console.log(d);
                        return d._interfaceId === port.physical
                    })[0];
                    var iface = $scope.interfaces.filter(function (d) {
                        console.log(d);
                        return (d._name === "intEth 1" && d._cardId === equipment._cardId)
                    })[0];
                    if (response.response.operation.result.error) {
                        console.log("Error creating the network service.");
                        $scope.errorMessage = response.response.operation.result.errorStr;
                    }
                    arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, equipment._cardId, iface._interfaceId, 2)).then(function (response) {});
                });
                arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, 0, 8781824, 2)).then(function (response) {
                    console.log(response);
                    var arnClientService = {
                        networkServiceId: "id",
                        admin: "2",
                        name: "test-service",
                        uniVlan: ""
                    };
                    //configure client service
                    //$scope.createClientService(arnClientService);
                });
                /*arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, $scope.cards[3].id, $scope.cards[3].interface, 2)).then(function (response) {});
                arnService.put(addPortsToNetworkService(response.response.operation.networkService._id, $scope.cards[4].id, $scope.cards[4].interface, 2)).then(function (response) {});*/
            });



        };

        //to remove????
        $scope.createCFMService = function (cpeSvc) {

            url = "ingress_port_setting.html?unit=0&port_id=" + clusterId + "&rx_enable=1&crc_check=1&my_mac=00:01:03:05:06:05";
            cpeService.post(url).then(function (response) {});

            url = "ingress_port_setting.html?unit=0&port_id=" + cpeSvc.srcPort + "&rx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + clusterId + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            url = "egress_port_setting.html?unit=0&port_id=" + cpeSvc.srcPort + "&tx_enable=1&crc_check=1";
            cpeService.post(url).then(function (response) {});

            var possibleId = Math.floor((Math.random() * 200) + 1);
            var inServiceId = null;
            var outServiceId = null;
            while (inServiceId === null) {
                //find should replace filter?
                var l = $scope.cpeServices.filter(function (d) {
                    return d.serviceId === "6"
                });
                if (l.length > 0) inServiceId = possibleId;
                else possibleId = Math.floor((Math.random() * 200) + 1);
                outServiceId = inServiceId + 1
            }

            url = "createServiceVlan.html?unit=0&serviceId=" + inServiceId + "&srcPort=" + cpeSvc.srcPort + "&policerId=" + cpeSvc.police.id + "&pmId=5&eIngressType=1&outer_vlanId=" + cpeSvc.innerVlan + "&clusterId=" + clusterId + "&vlanEdit_flowtype=2&vlanEdit_outer_command=3&vlanEdit_outer_vlan=" + cpeSvc.innerVlan;

            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });

            url = "createServiceVlan.html?unit=0&serviceId=" + outServiceId + "&srcPort=" + clusterId + "&policerId=" + cpeSvc.police.id + "&pmId=5&eIngressType=1&outer_vlanId=" + cpeSvc.innerVlan + "&clusterId=" + cpeSvc.srcPort + "&vlanEdit_flowtype=2&vlanEdit_outer_command=3&vlanEdit_outer_vlan=" + cpeSvc.innerVlan;

            cpeService.post(url).then(function (response) {
                console.log(response);
                $scope.cpeServices = checkIfIsArray(response.meaServiceMap);
            });
            //ccmSetting.htmlunit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=710&srcPort=105&megLevel=4&cfmVersion=0&ccmPeriod=1&rdiEnable=1&megId=ccmTest&lmEnable=1&remoteMepId=10&localMepId=9&policerId=3&outServiceId=9&inServiceId=8&Priority=7
            url = "ccmSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=" + cpeSvc.innerVlan + "0&srcPort=" + cpeSvc.srcPort + "&megLevel=4&cfmVersion=0&ccmPeriod=1&rdiEnable=1&megId=ccmTest&lmEnable=1&remoteMepId=10&localMepId=9&policerId=" + policerId + "&outServiceId=" + outService + "&inServiceId=" + inService + "&Priority=7";
            cpeService.post(url).then(function (response) {});
        };

        $scope.deleteCpeService = function (serviceId) {
            url = "deleteServiceVlan.html?unit=0&serviceId=" + serviceId;
            cpeService.get(url).then(function (response) {});
        };

        $scope.endToEndConnectivity = function () {
            //source_resource
            //target_resource
            //read the list of links
            //vlans
        };


        $scope.cards = [];
        $scope.interfaces = [];

        $scope.getEthernetInterfaces = function (id) {
            $scope.dataCollection = [];
            arnService.put(getCardInterfaces(id)).then(function (data) {
                $scope.dataCollection = data.response.operation.interfaceList.interface;
            });
        };
        $scope.getARNCards = function () {
            $scope.cards = [];
            $scope.dataCollection = [];
            var data = getCards();
            arnService.put(data).then(function (response) {
                console.log(response);
                $scope.cards = response.response.operation.cardList.card;
            });
        };

    });
