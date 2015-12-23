'use strict';

angular.module('mqnaasApp')
    .controller('spStatsController', function ($rootScope, $scope, $modal, $interval, $window, $stateParams, IMLService, AuthService, spService, arnService, cpeService, VirtualService, MQNAAS) {

        //hardcoded
        //$rootScope.networkId = "Network-Internal-1.0-2";
        //$rootScope.virtNetId = "Network-virtual-7";

        if ($stateParams.id) $rootScope.virtNetId = $stateParams.id;
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];
        $scope.selected = ""; //unused???
        $scope.selectedResource = "";
        $scope.selectedNetwork;
        var promise, url;

        $scope.getNetworkResources = function () {
            var url = 'viNetworks/' + $scope.virtNetId;
            IMLService.get(url).then(function (data) {
                var resourceArray = data;
                resourceArray.vi_resources.forEach(function (res) {
                    $scope.virtualResources.push(res);
                });
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
                        var url = 'viNetworks';
                        IMLService.get(url).then(function (result) {
                            if (!result) return;
                            $rootScope.networkCollection.push(result);
                        });
                    })
                });
            });
        }

        $scope.setVirtualNetwork = function () {
            $rootScope.virtNetId = $scope.selectedNetwork.id;
            $rootScope.networkId = $scope.selectedNetwork.physicalNetwork;
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
            console.log($rootScope.virtualResource);
            console.log($scope.interface);
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

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
    });
