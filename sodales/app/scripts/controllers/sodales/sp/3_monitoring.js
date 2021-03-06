'use strict';

angular.module('mqnaasApp')
    .controller('spStatsController', function ($rootScope, $scope, $modal, $interval, $window, $stateParams, IMLService, AuthService, spService, arnService, cpeService, VirtualService) {

        if ($stateParams.id) $rootScope.virtNetId = $stateParams.id;
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];
        $scope.selected = ""; //unused???
        $scope.selectedResource = "";
        //$scope.selectedNetwork;
        var promise, url;
        var promise2;

        $scope.getNetworkResources = function () {
            var url = 'viNetworks/' + $rootScope.virtNetId;
            IMLService.get(url).then(function (data) {
                var resourceArray = data;
                resourceArray.vi_resources.forEach(function (res) {
                    $scope.virtualResources.push(res);
                });
            });
        };

        if ($rootScope.virtNetId) {
            $scope.getNetworkResources();
        } else {
            AuthService.profile().then(function (data) {
                spService.get(data.sp_id).then(function (data) {
                    $scope.networks = data.vis;
                    data.vis.forEach(function (viNet) {
                        var url = 'viNetworks';
                        IMLService.get(url).then(function (result) {
                            if (!result) return;
                            $rootScope.networkCollection = result;
                        });
                    })
                });
            });
        }

        $scope.setVirtualNetwork = function () {
            $rootScope.virtNetId = $scope.selectedNetwork;
            //$rootScope.networkId = $scope.selectedNetwork.physicalNetwork;
            $scope.getNetworkResources();
        };

        $scope.dropdown = [{
            "text": "System notifications",
            "click": "selectResource('', 'ARN/OAM')"
        }];
        $scope.dropdown2 = [{
            "text": "CFM/OAM",
            "click": "selectResource('', 'CFM/OAM')"
        }];

        $scope.dropdown = [{
            "text": "System notifications",
            "click": "selectResource('" + $scope.selectedResource + "', 'ARN/OAM')"
        }];

        $scope.dropdown2 = [{
            "text": "CFM/OAM",
            "click": "selectResource('" + $scope.selectedResource + "', 'CFM/OAM')"
        }];

        $scope.selectResource = function (resourceName, resourceType) {
            $scope.selectedResource = resourceName;
            console.log("Click resource " + resourceName);
            // $scope.dropdown[0].click = "selectResource('" + $scope.selectedResource + "', 'ARN/OAM')";
            $scope.dropdown2[0].click = "selectResource('" + $scope.selectedResource + "', 'CFM/OAM')";
            //get resourceInfo from OpenNaaS.

            url = 'viNetworks/' + $rootScope.virtNetId + '/resource/' + resourceName;
            IMLService.get(url).then(function (data) {
                $rootScope.resourceUri = data.endpoint;

                //load default statistic info
                //open Dropdown list, depending on the resourceType
                $scope.selected = resourceName;
                if (resourceType === 'CPE') {
                    //$scope.getCPEPortList();
                    $scope.getAvailableInterfaces();
                } else if (resourceType === 'CFM/OAM') {
                    $scope.getCCM();
                    $scope.getLBM();
                    $scope.getDMM();
                } else if (resourceType === 'ARN') {
                    $scope.getAvailableInterfaces();
                } else if (resourceType === 'ARN/OAM') {
                    $scope.getNotificationsLogging();
                }
            });
        };

        $scope.updateInterface = function () {
            var port = $scope.interface.physical;
            if ($scope.virtualResource.type === 'ARN') {
                $scope.arnStats = true;
                $scope.cpeStats = false;
                arnService.put(getInterface(port)).then(function (response) {
                    console.log(response);
                    $scope.arnLinkStatus = response.response.operation.interfaceList.interface;
                });
            } else if ($scope.virtualResource.type === 'CPE') {
                $scope.arnStats = false;
                $scope.cpeStats = true;
                var reqListPortsUrl = "meaEgressPortInfo.xml?unit=0&port_id=" + port;
                cpeService.get(reqListPortsUrl).then(function (response) {
                    $scope.cpePortStatus = response.meaEgressPort.egress_Data;
                });
            }
        };

        $scope.getAvailableInterfaces = function () {
            //get OpenNaaS Ports
            var virtualResource = $scope.selectedResource;
            //VirtualService.virtualPorts(virtualResource);
            VirtualService.getResourceNetwork(virtualResource);
        };

        $scope.getCPEPortList = function () {
            url = "meaPortMapping.xml?unit=0";
            cpeService.get(url).then(function (response) {
                $scope.cpePortList = response.meaPortMapping.portMapping;
            });
        };

        $scope.getCPECounters = function () {
            url = "meaAllPmCounters.xml?unit=0";
            cpeService.get(url).then(function (response) {
                $scope.pmCounters = checkIfIsArray(response.meaPmCounter.PmCounterId);
            });
        };

        $scope.getCPECounter = function (portId) {
            url = "meaPmCounter.xml?unit=0&pmId=" + portId;
            cpeService.get(url).then(function (response) {
                $scope.pmCounter = response.meaPmCounter.PmCounter;
            });
        };

        $scope.getCCM = function (portId) {
            var reqUrl = "meaGetCcmDefectState.xml?unit=0&streamId=1";
            var xml = getCCMStats();
            var x2js = new X2JS();
            var json = x2js.xml_str2json(xml);
            //                $scope.ccmCounter = json.meaCcmCounter.CcmDefectCount;
            var data = json.meaCcmCounter.CcmDefectCount;
            console.log(data);
            cpeService.get(reqUrl).then(function (response) {
                console.log(response);
                $scope.ccmCounter = response.meaCcmCounter.CcmDefectCount;
            });
        };
        $scope.getLBM = function (portId) {
            var reqUrl = "meaGetLbmStatistics.xml?unit=0&stream_id=1";
            var xml = getLBMStats();
            var x2js = new X2JS();
            var json = x2js.xml_str2json(xml);
            //                $scope.lbmCounter = json.meaStatistics.lbmDmmStatistics;
            console.log(json);
            cpeService.get(reqUrl).then(function (response) {
                console.log(response);
                $scope.lbmCounter = response.meaStatistics.lbmDmmStatistics;
            });
        };
        $scope.getDMM = function (portId) {
            var reqUrl = "meaGetDmmStatistics.xml?unit=0&stream_id=1";
            var xml = getDMMStats();
            var x2js = new X2JS();
            var json = x2js.xml_str2json(xml);
            //                $scope.dmmCounter = json.meaStatistics.lbmDmmStatistics;
            console.log(json.meaStatistics.lbmDmmStatistics);
            cpeService.get(reqUrl).then(function (response) {
                console.log(response);
                var data = response.meaStatistics.lbmDmmStatistics;
                $scope.dmmCounter = response.meaStatistics.lbmDmmStatistics;
            });
        };

        $scope.getNotificationsLogging = function () {
            var requestData = getAlarmShow($scope.infId);
            arnService.put(requestData).then(function (response) {
                console.log(response);
                //$scope.notiLog = response.response.operation.cardList.card.status;
                $scope.notiLog = response.response.operation.alarmRegisterList.alarmRegister;
                console.log($scope.notiLog);
                $scope.arnOAM = $scope.notiLog;
            });
            $scope.equipmentBoards();
        };

        $scope.viewStatistics = function (cardId, interfaceId) {
            $scope.infId = interfaceId;

            var requestData = getCounters(cardId, interfaceId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
                console.log(data)
                data = transpose(data);
                $scope.content = data;
                $modal({
                    title: 'Counter statistics of interface ' + interfaceId,
                    template: 'views/modals/counterStats.html',
                    show: true,
                    scope: $scope
                        //,controller: 'statisticsCtrl',
                });
            });
        };

        $scope.arnCounterStatistics = function (cardId, interfaceId) {
            console.log();
            var initial;
            if ($scope.arnCounterEnd !== 0) initial = $scope.arnCounterEnd;
            var end;
            var requestData = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showCounters" entity="interface/ethernet"><ethernet equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation></request>';
            arnService.put(requestData).then(function (response) {
                end = response.response.operation.interfaceList.interface.ethernet.counters;
            });

        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
        var items;
        $scope.createPacketsGraph = function (cardId, interfaceId) {
            $scope.arnCounterStatistics(cardId, interfaceId);

            $scope.infId = interfaceId;
            var groups = new vis.DataSet();
            groups.add({
                id: 0,
                content: "packets64Octets"
            })
            groups.add({
                id: 1,
                content: "packets65to127Octets"
            })
            groups.add({
                id: 2,
                content: "packets128to255Octets"
            });
            groups.add({
                id: 3,
                content: "packets256to511Octets"
            });
            groups.add({
                id: 4,
                content: "packets512to1023Octets"
            });
            groups.add({
                id: 5,
                content: "packets1024to1518Octets"
            });
            items = [];
            var res = [];
            var resRx = [];
            var requestData = getCounters(cardId, interfaceId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
                _.each(data.rx, function (val, key) {
                    if (key.indexOf("_packets") !== -1) {
                        resRx.push({
                            label: key,
                            value: parseInt(val)
                        })
                    }
                });
                _.each(data.tx, function (val, key) {
                    if (key.indexOf("_packets") !== -1) {
                        res.push({
                            label: key,
                            value: parseInt(val)
                        })
                    }
                    if (key === '_packets64Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 0
                        });
                    else if (key === '_packets65to127Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 1
                        });
                    else if (key === '_packets128to255Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 2
                        });
                    else if (key === '_packets256to511Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 3
                        });
                    else if (key === '_packets512to1023Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 4
                        });
                    else if (key === '_packets1024to1518Octets')
                        items.push({
                            x: new Date(),
                            y: parseInt(val),
                            group: 5
                        });
                    console.log(items);

                });
                console.log(items);
                $scope.packetsData = {
                    items: items,
                    groups: groups
                };
                $scope.chartsTx = {
                    title: 'Transmited packets',
                    description: 'Transmited packets according the packet size',
                    data: res,
                    chart_type: 'bar',
                    x_accessor: 'value',
                    y_accessor: 'label',
                    width: 295,
                    height: 150,
                    right: 10,
                    animate_on_load: true,
                    target: '#bar2',
                    left: 100
                };
                $scope.chartsRx = {
                    title: 'Recevied packets',
                    description: 'Recevied packets according the packet size',
                    data: resRx,
                    chart_type: 'bar',
                    x_accessor: 'value',
                    y_accessor: 'label',
                    width: 295,
                    height: 150,
                    right: 10,
                    animate_on_load: true,
                    target: '#bar2',
                    left: 100
                };
                $scope.$broadcast("toggleAnimation", $scope.chartsTx);
                $scope.$broadcast("toggleAnimation", $scope.chartsRx);
            });
        };

        $scope.arnCounterStatistics = function (cardId, interfaceId) {

            var groups = new vis.DataSet();
            groups.add({
                id: 0,
                content: "Transmission (packets)",
                options: {
                    drawPoints: {
                        style: 'square' // square, circle
                    },
                    shaded: {
                        orientation: 'bottom' // top, bottom
                    }
                }
            });

            groups.add({
                id: 1,
                content: "Reception (packets)",
                options: {
                    drawPoints: {
                        style: 'circle' // square, circle
                    },
                    shaded: {
                        orientation: 'bottom' // top, bottom
                    }
                }
            });

            $scope.options = {
                dataAxis: {
                    showMinorLabels: false
                },
                legend: {
                    left: {
                        position: "bottom-left"
                    }
                },
                start: vis.moment().add(-10, 'seconds'), // changed so its faster
                end: vis.moment(),
            };
            var items = [];

            $scope.data = {
                items: new vis.DataSet(items),
                groups: groups
            };
            if (promise2) {
                $interval.cancel(promise2);
            }
            var initial;
            if ($scope.arnCounterEnd !== 0) initial = $scope.arnCounterEnd;
            var end;
            var initialTx = 0,
                initialRx = 0;
            $scope.packetsData2 = [];
            promise2 = $interval(function () {
                var requestData = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showCounters" entity="interface/ethernet"><ethernet equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation></request>';
                arnService.put(requestData).then(function (response) {
                    end = response.response.operation.interfaceList.interface.ethernet.counters;
                    if ($scope.data.items.get().length === 0) {
                        initialTx = parseInt(end.tx._packets);
                        initialRx = parseInt(end.rx._packets);
                        currentTx = currentRx = 0;
                    } else {
                        var currentTx = parseInt(end.tx._packets) - initialTx;
                        var currentRx = parseInt(end.rx._packets) - initialRx;
                        initialTx = end.tx._packets;
                        initialRx = end.rx._packets;
                    }
                    $scope.data.items.add({
                        x: new Date(),
                        y: currentTx,
                        group: 0
                    });
                    $scope.data.items.add({
                        x: new Date(),
                        y: currentRx,
                        group: 1
                    });
                });
            }, 5000);
        };
    });
