angular.module('mqnaasApp')
    .controller('SodalesMonitoringController', function ($rootScope, $scope, $filter, $modal, arnService, cpeService, $interval, $window, IMLService) {
        var promise;
        var promise2;
        var availableResources = [];
        $scope.selectedResource = "";
        $scope.physicalResources = [];
        $scope.cards = [];
        $scope.monitored_data = "";

        //getMqnaas model. For each ARN and CPE, add to available Resources array

        if ($window.localStorage.networkId) $rootScope.netId = $window.localStorage.networkId;
        else $rootScope.netId = null;

        $scope.updateResourceList = function () {
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                if (!data) return;

                $scope.listNetworks = data;
                if ($scope.listNetworks.length === 1) {
                    $rootScope.networkId = '';
                    $window.localStorage.networkId = '';
                }
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[0].id;
                    $window.localStorage.networkId = JSON.stringify(data[0].id);
                }
                // $scope.selectedNetwork = $rootScope.networkId.id;

                url = "phyNetworks/" + $rootScope.networkId;
                IMLService.get(url).then(function (data) {
                    $scope.physicalResources = data.phy_resources;
                });
            });
        };

        $scope.updateResourceList();

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
            $scope.dropdown[0].click = "selectResource('" + $scope.selectedResource + "', 'ARN/OAM')";
            $scope.dropdown2[0].click = "selectResource('" + $scope.selectedResource + "', 'CFM/OAM')";
            $scope.cpePorts = undefined;
            $scope.arnInterfaces = undefined;
            $scope.arnOAM = undefined;

            //get resourceModel of the resource -> extract endpoint URI
            url = "phyNetworks/" + $rootScope.networkId + '/resource/' + resourceName;
            IMLService.get(url).then(function (data) {
                $rootScope.resourceUri = data.endpoint;

                $scope.cards = [];
                $scope.card = {};
                if (resourceType === 'CPE') {
                    $scope.getCPEPortList();
                } else if (resourceType === 'CFM/OAM') {
                    $scope.CFM_OAM = true;
                    $scope.getCCM();
                    $scope.getLBM();
                    $scope.getDMM();
                } else if (resourceType === 'ARN') {
                    $scope.getARNStats();
                } else if (resourceType === 'ARN/OAM') {
                    $scope.getNotificationsLogging();
                }
            });
        };

        $scope.updateCard = function (d) {
            var data = getLinkStatus(d._id);
            arnService.put(data).then(function (response) {
                $scope.arnInterfaces = response.response.operation.interfaceList.interface;
            });
        };

        $scope.getARNStats = function () {
            $scope.monitored_data = "ARN interfaces";
            var data = getCards();
            arnService.put(data).then(function (response) {
                $scope.cards = response.response.operation.cardList.card;
            });

            var data = getLinkStatus();
            arnService.put(data).then(function (response) {
                $scope.arnInterfaces = response.response.operation.interfaceList.interface;
            });
        };

        $scope.getCPEPortList = function () {
            $scope.monitored_data = "CPE interfaces";
            var reqListPortsUrl = "meaPortMapping.xml?unit=0";
            $scope.cpePorts = [];
            cpeService.get(reqListPortsUrl).then(function (response) {
                $scope.cpePortList = response.meaPortMapping.portMapping;
                angular.forEach($scope.cpePortList, function (port) {
                    //$scope.getCPEStats(port.port); 
                });
            });
        };
        $scope.getCPEStats = function (d) {
            var reqUrl = "meaPmCounter.xml?unit=0&pmId=" + d.port;
            $interval.cancel(promise);
            //            promise = $interval(function () {
            cpeService.get(reqUrl).then(function (response) {
                $scope.content = response.meaPmCounter.PmCounter;
                $scope.cpePorts.push({
                    portId: d.port,
                    counter: response.meaPmCounter.PmCounter
                });
            });
            //            }, 1000);
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
                if (response === undefined) return;
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
                if (response === undefined) return;
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
                if (response === undefined) return;
                console.log(response);
                var data = response.meaStatistics.lbmDmmStatistics;
                $scope.dmmCounter = response.meaStatistics.lbmDmmStatistics;
            });
        };

        $scope.getNotificationsLogging = function () {
            $scope.monitored_data = "Alarms";
            var requestData = getAlarmShow();
            arnService.put(requestData).then(function (response) {
                //$scope.notiLog = response.response.operation.cardList.card.status;
                //$scope.notiLog = checkIfIsArray(response.response.operation.alarmRegisterList); //.alarmRegister;
                $scope.notiLog = checkIfIsArray(response.response.operation.alarmRegisterList.alarmRegister); //.alarmRegister;
                angular.forEach($scope.notiLog, function (alarm) {
                    var al = arnAlarmList.filter(function (a) {
                        if (a.id === parseInt(alarm._code)) {
                            alarm._code = a.name;
                            return a.name;
                        }
                    });

                });
                $scope.arnOAM = $scope.notiLog;
            });
        };

        $scope.viewStatistics = function (cardId, interfaceId) {
            $scope.infId = interfaceId;

            var requestData = getCounters(cardId, interfaceId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
                data = transpose(data);
                $scope.content = data;
                $modal({
                    title: 'Counter statistics of interface ' + interfaceId,
                    template: 'views/modals/counterStats.html',
                    show: true,
                    scope: $scope
                });
            });
        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
            if (promise2) {
                $interval.cancel(promise2);
            }
        });

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
            var requestData = getCounters(cardId, interfaceId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
                _.each(data.tx, function (val, key) {
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
            });
        };

        $scope.arnCounterStatistics = function (cardId, interfaceId) {
            console.log();
            var initial;
            if ($scope.arnCounterEnd !== 0) initial = $scope.arnCounterEnd;
            var end;
            $scope.packetsData2 = [];
            promise2 = $interval(function () {
                var requestData = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="showCounters" entity="interface/ethernet"><ethernet equipmentId="0" cardId="' + cardId + '" interfaceId="' + interfaceId + '"/></operation></request>';
                arnService.put(requestData).then(function (response) {
                    end = response.response.operation.interfaceList.interface.ethernet.counters;
                    console.log(end);
                    console.log(parseInt(end.tx._packets));
                    $scope.packetsData2.push({
                        x: new Date(),
                        y: parseInt(end.tx._packets)
                    });
                });
            }, 5000);
        };
    });
