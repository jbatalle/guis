angular.module('mqnaasApp')
    .controller('SodalesMonitoringController', function ($rootScope, $scope, $filter, localStorageService, $modal, arnService, cpeService, $interval, $window, MqNaaSResourceService) {
        var promise;
        var availableResources = [];
        $scope.selected = "";
        $scope.selectedResource = "";
        $scope.physicalResources = [];
        $scope.cards = [];

        //getMqnaas model. For each ARN and CPE, add to available Resources array

        if ($window.localStorage.networkId) $rootScope.netId = $window.localStorage.networkId;
        else $rootScope.netId = null;

        $scope.updateResourceList = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceProvider');
            MqNaaSResourceService.list(url).then(function (data) {
                var resourceArray = checkIfIsArray(data.IRootResource.IRootResourceId);
                resourceArray.forEach(function (res) {
                    $scope.physicalResources.push({
                        name: res,
                        type: res.split("-")[0]
                    });
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

        $scope.updateCard = function () {
            var data = getCardInterfaces($scope.card._id);
            arnService.put(data).then(function (response) {
                $scope.interfaces = response.response.operation.interfaceList.interface;
            });
        };

        $scope.selectResource = function (resourceName, resourceType) {
            $scope.selectedResource = resourceName;
            console.log("Click resource " + resourceName);
            $scope.dropdown[0].click = "selectResource('" + $scope.selectedResource + "', 'ARN/OAM')";
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

        $scope.getARNStats = function () {
            var data = getCards();
            arnService.put(data).then(function (response) {
                $scope.cards = response.response.operation.cardList.card;
            });

            var data = getLinkStatus();
            arnService.put(data).then(function (response) {
                var data = response.response.operation.interfaceList.interface;
                $scope.arnLinkStatus = data;
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
                $scope.notiLog = checkIfIsArray(response.response.operation.alarmRegisterList); //.alarmRegister;
                $scope.arnOAM = $scope.notiLog;
            });
            $scope.equipmentBoards();

        };

        $scope.equipmentBoards = function () {
            var requestData = getEquipment($scope.infId);
            var xml = equipmentBoardsStats();
            var x2js = new X2JS();
            var json = x2js.xml_str2json(xml);
            console.log(json);
            $scope.equipBoard = json.response.operation.alarmRegisterList.alarmRegister;
            //                arnService.put(requestData).then(function (json.response.operation.alarmRegisterList) {
            var data = json.response.operation.alarmRegisterList.alarmRegister;
            console.log(data);
            //                $scope.data = data.response.operation.interfaceList.interface;
            //                localStorageService.set("mqNaaSElements", data);
            //                console.log($scope.data);

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
