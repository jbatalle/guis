'use strict';

angular.module('mqnaasApp')
    .controller('spStatsController', function ($rootScope, $scope, $filter, localStorageService, $modal, arnService, cpeService, $interval, $window, MqNaaSResourceService, $stateParams, AuthService, spService) {

        //hardcoded
        //$rootScope.networkId = "Network-Internal-1.0-2";
        //$rootScope.virtNetId = "Network-virtual-7";

        $rootScope.virtNetId = $stateParams.id;
        $scope.virtualResources = [];
        $rootScope.networkCollection = [];
        $scope.selected = ""; //unused???
        $scope.selectedResource = "";
        $scope.selectedNetwork;
        var promise, url;

        $scope.getNetworkResources = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider";
            MqNaaSResourceService.get(url).then(function (data) {
                var resourceArray = checkIfIsArray(data.IRootResource.IRootResourceId);
                resourceArray.forEach(function (res) {
                    $scope.virtualResources.push({
                        name: res,
                        type: res.split("-")[0]
                    });
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
            //load default statistic info
            //open Dropdown list, depending on the resourceType
            $scope.selected = resourceName;
            if (resourceType === 'CPE') {
                $scope.getCPEPortList();
            } else if (resourceType === 'CFM/OAM') {
                $scope.getCCM();
                $scope.getLBM();
                $scope.getDMM();
            } else if (resourceType === 'ARN') {
                $scope.getARNStats();
            } else if (resourceType === 'ARN/OAM') {
                $scope.getNotificationsLogging();
            }
        };

        $scope.updateInterface = function () {
            var data = getInterface($scope.interface.attributes.entry[0].value);
            arnService.put(data).then(function (response) {
                console.log(response);
                //var data = response.response.operation.interfaceList.interface;
                $scope.arnLinkStatus = response.response.operation.interfaceList.interface;
            });
        };

        $scope.getARNStats = function () {
            //get OpenNaaS Ports
            var virtualResource = $scope.selectedResource;
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement/' + $scope.virtNetId + '/IRootResourceProvider/' + virtualResource + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                $rootScope.virtualResource = data.resource;
                $rootScope.physicalPorts = checkIfIsArray(data.resource.resources.resource);

                $rootScope.virtualResource.ports = [];

                var ports = $rootScope.physicalPorts;
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/slice";
                MqNaaSResourceService.getText(url).then(function (result) {
                    var slice = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/" + slice + "/ISliceAdministration/cubes";
                    MqNaaSResourceService.get(url).then(function (result) {
                        var cubes = checkIfIsArray(result.cubesList.cubes);
                        cubes.forEach(function (cube) {
                            if (cube.cube.ranges.range.lowerBound === cube.cube.ranges.range.upperBound) {
                                $rootScope.virtualResource.ports.push(ports[parseInt(cube.cube.ranges.range.lowerBound)]);
                            } else {
                                var k = parseInt(cube.cube.ranges.range.lowerBound);
                                while (k <= parseInt(cube.cube.ranges.range.upperBound)) {
                                    $rootScope.virtualResource.ports.push(ports[k]);
                                    k++;
                                }
                            }
                        });
                    });
                });
            });
        };

        $scope.getCPEPortList = function () {
            var reqListPortsUrl = "meaPortMapping.xml?unit=0";
            cpeService.get(reqListPortsUrl).then(function (response) {
                $scope.cpePortList = response.meaPortMapping.portMapping;
            });
        };
        $scope.getCPEStats = function (portId) {
            var reqUrl = "meaPmCounter.xml?unit=0&pmId=" + portId;
            $interval.cancel(promise);
            promise = $interval(function () {

                cpeService.get(reqUrl).then(function (response) {
                    $scope.content = response.meaPmCounter.PmCounter;
                    console.log($scope.content);
                });
            }, 1000);
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
                    template: 'views/sodales/counterStats.html',
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
