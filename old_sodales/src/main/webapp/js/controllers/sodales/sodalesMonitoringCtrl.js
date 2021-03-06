'use strict';

angular.module('openNaaSApp')
        .controller('SodalesMonitoringController', function ($scope, ngTableParams, $filter, $routeParams, localStorageService, ngDialog, arnService, cpeService, $interval) {
            var promise;
            var availableResources = [];
            $scope.selected = "";
            localStorageService.get("networkElements").forEach(function (el) {
                console.log(el);
                if (el !== null)
                    availableResources.push({name: el, type: el.split("-")[0]});
            });
            $scope.availableResources = availableResources;

            $scope.dropdown2 = [{"text": "System notifications", "click": "selectedResource('', 'ARN/OAM')"}];
            $scope.dropdown = [{"text": "CFM/OAM", "click": "selectedResource('', 'CFM/OAM')"}];
            $scope.selectedResource = function (resourceName, resourceType) {
                //get statistics and send to scope
                console.log("Selected " + resourceName);
                if (resourceType === 'CPE') {
                    $scope.selected = resourceName;
                    $scope.noResource = false;
                    $scope.CPEactive = "active";
                    $scope.ARNactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = true;
                    $scope.CFM_OAM = false;
                    $scope.ARN_OAM = false;
                    $scope.getCPEPortList();
                }
                else if (resourceType === 'CFM/OAM') {
                    $scope.selected = resourceName;
                    $scope.noResource = false;
                    $scope.CPEactive = "active";
                    $scope.ARNactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = false;
                    $scope.CFM_OAM = true;
                    $scope.ARN_OAM = false;
                    $scope.getCCM();
                    $scope.getLBM();
                    $scope.getDMM();
                } else if (resourceType === 'ARN') {
                    $scope.selected = resourceName;
                    $scope.noResource = false;
                    $scope.ARNactive = "active";
                    $scope.CPEactive = "";
                    $scope.ARNStats = true;
                    $scope.CPEStats = false;
                    $scope.CFM_OAM = false;
                    $scope.ARN_OAM = false;
                    $scope.getARNStats();
                } else if (resourceType === 'ARN/OAM') {
                    $scope.selected = resourceName;
                    $scope.noResource = false;
                    $scope.ARNactive = "active";
                    $scope.CPEactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = false;
                    $scope.CFM_OAM = false;
                    $scope.ARN_OAM = true;
                    $scope.getNotificationsLogging();
                }
            };
            $scope.getARNStats = function () {
                console.log("REQUEST ARN Stats");
                //            var data = getLAGs();
                var data = getLinkStatus();
                arnService.put(data).then(function (response) {
                    var data = response.response.operation.interfaceList.interface;
                    console.log(data);
                    $scope.element = $routeParams.id;
//                $scope.data = data.response.operation.interfaceList.interface;
//                localStorageService.set("mqNaaSElements", data);
//                console.log($scope.data);
                    $scope.tableParams = new ngTableParams({
                        page: 1, // show first page
                        count: 10, // count per page
                        sorting: {
                            date: 'desc'     // initial sorting
                        }
                    }, {
                        total: data.length,
                        getData: function ($defer, params) {
                            console.log(data);
                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        },
                        $scope: {$data: {}}
                    });
                });
            };
            $scope.getCPEPortList = function () {
                console.log();
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

            $scope.$on("$destroy", function () {
                if (promise) {
                    $interval.cancel(promise);
                }
            });

            $scope.getCCM = function (portId) {
                var reqUrl = "meaGetCcmDefectState.xml?unit=0&streamId=1";
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaCcmCounter xmlns="http://www.ethernity-net.com/enet/CcmCounter"><CcmDefectCount><unit>0</unit><LastSequenc>1832557</LastSequenc><Unexpected_MEG_ID>0</Unexpected_MEG_ID><Unexpected_MEP_ID>0</Unexpected_MEP_ID><reorder>4</reorder><eventLoss>0</eventLoss></CcmDefectCount></meaCcmCounter>';
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
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>0</AVG_latency><Bytes>1735000</Bytes><MAX_jitter>0</MAX_jitter><MIN_jitter>4294967295</MIN_jitter><Pkts>1735</Pkts><drop>0</drop><lastseqID>1754</lastseqID><num_Of_Bits_Error>6695669</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
                var x2js = new X2JS();
                var json = x2js.xml_str2json(xml);
//                $scope.lbmCounter = json.meaStatistics.lbmDmmStatistics;
                console.log(json.meaStatistics.lbmDmmStatistics);
                cpeService.get(reqUrl).then(function (response) {
                    console.log(response);
                    $scope.lbmCounter = response.meaStatistics.lbmDmmStatistics;
                });
            };
            $scope.getDMM = function (portId) {
                var reqUrl = "meaGetDmmStatistics.xml?unit=0&stream_id=1";
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>5408</AVG_latency><Bytes>0</Bytes><MAX_jitter>6240</MAX_jitter><MIN_jitter>5312</MIN_jitter><Pkts>0</Pkts><drop>0</drop><lastseqID>0</lastseqID><num_Of_Bits_Error>0</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
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

            $scope.configureCCM = function () {
                var url = "ccmSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=10&srcPort=104&megLevel=4&cfmVersion=0&ccmPeriod=1&rdiEnable=1&megId=ccmTest&lmEnable=1&remoteMepId=10&localMepId=9&policerId=3&outServiceId=6&inServiceId=7&Priority=7";
                cpeService.get(url).then(function (response) {
                });
                url = "meaGetCcmConfig.xml?unit=0&stream_id=1";
                cpeService.get(url).then(function (response) {
                });
            };

            $scope.configureLBM = function () {
                var url = "lbSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=11&srcPort=104&megLevel=4&cfmVersion=0&policerId=3&Priority=4&lbmSide=1";
                cpeService.get(url).then(function (response) {
                });
                url = "meaGetLbConfig.xml?unit=0&stream_id=1";
                cpeService.get(url).then(function (response) {
                });
            };

            $scope.configureDMM = function () {
                var url = "dmSetting.html?unit=0&stream_id=1&activate=1&destMac=00:01:03:05:06:09&vlanId=12&srcPort=104&megLevel=4&cfmVersion=0&policerId=3&Priority=4&dmmSide=1";
                cpeService.get(url).then(function (response) {
                });
                url = "meaGetDmConfig.xml?unit=0&stream_id=1";
                cpeService.get(url).then(function (response) {
                });
            };

            $scope.getNotificationsLogging = function () {
                var requestData = getAlarmShow($scope.infId);
                arnService.put(requestData).then(function (response) {
                    $scope.notiLog = response.response.operation.cardList.card.status;
                });
                $scope.equipmentBoards();
                $scope.tableParams.reload();
            };

            $scope.equipmentBoards = function () {
                var requestData = getEquipment($scope.infId);
                var xml = "<?xml version='1.0' encoding='utf-8'?><response timestamp='1421071666' localDate='2015/01/12' localTime='14:07:46' version='3.5.0-r' ><operation type='show' entity='alarmRegister' ><alarmRegisterList><alarmRegister id='0' code='36866' accessType='0' startOrEnd='1' timeStamp='1421071626' localTimeStamp='1421071666' interfaceId='83951616' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='1' code='99901' accessType='0' startOrEnd='1' timeStamp='1421071627' localTimeStamp='1421071666' interfaceId='83951616' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='2' code='36866' accessType='0' startOrEnd='1' timeStamp='1421071628' localTimeStamp='1421071666' interfaceId='83951617' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /><alarmRegister id='3' code='99901' accessType='0' startOrEnd='1' timeStamp='1421071629' localTimeStamp='1421071666' interfaceId='83951617' accessIndex='' accessInterface='' lagMember='' success='' serviceId='' macAddr='' /></alarmRegisterList><result error='00000000' errorStr='OK'/></operation></response>";
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
                $scope.tableParamsBoard = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    sorting: {
                        date: 'desc'     // initial sorting
                    }
                }, {
                    total: data.length,
                    getData: function ($defer, params) {
                        console.log(data);
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    },
                    $scope: {$data: {}}
//s                    });
                });
            };
            
            $scope.viewStatistics = function (interfaceId) {
                $scope.infId = interfaceId;
                ngDialog.open({
                    template: 'partials/sodales/counterStats.html',
                    controller: 'statisticsCtrl',
                    scope: $scope}
                );
            };
            $scope.navClass = function (page) {

                return page === $scope.selected ? 'active' : '';
            };
            $scope.getClass = function (ind) {
                console.log("GET CLASS");
                if (ind === "ARN") {
                    return "ARNactive";
                } else {
                    return "CPEactive";
                }
            };

//            $scope.selectedResource("ARN");
            if (availableResources.length > 0)
                $scope.selectedResource(availableResources[0].type);
            $scope.noResource = true;
        })
        .controller('statisticsDialogCtrl', function ($scope, ngTableParams, $filter, localStorageService, arnService, $interval) {
            var promise;
            var requestData = getCounter($scope.infId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
//                data = {"tx": {"_dropEvents": "1", "_octets": "2", "_packets": "3", "_broadcastPackets": "4", "_multicastPackets": "0", "_crcAlignErrors": "0", "_undersizePackets": "0", "_oversizePackets": "0", "_fragments": "0", "_jabbers": "0", "_collisions": "0", "_packets64Octets": "0", "_packets65to127Octets": "0", "_packets128to255Octets": "0", "_packets256to511Octets": "0", "_packets512to1023Octets": "0", "_packets1024to1518Octets": "0", "_throughput": "0"}, "rx": {"_dropEvents": "21", "_octets": "22", "_packets": "23", "_broadcastPackets": "24", "_multicastPackets": "0", "_crcAlignErrors": "0", "_undersizePackets": "0", "_oversizePackets": "0", "_fragments": "0", "_jabbers": "0", "_collisions": "0", "_packets64Octets": "0", "_packets65to127Octets": "0", "_packets128to255Octets": "0", "_packets256to511Octets": "0", "_packets512to1023Octets": "0", "_packets1024to1518Octets": "0", "_throughput": "0"}};
                data = transpose(data);
                $scope.content = data;
                $interval.cancel(promise);

            });
            promise = $interval(function () {
                var requestData = getCounter($scope.infId);
                arnService.put(requestData).then(function (response) {
                    var data = response.response.operation.interfaceList.interface.ethernet.counters;
                    data = transpose(data);
                    $scope.content = data;
                    console.log($scope.content);
                });
            }, 1000);

            $scope.$on("$destroy", function () {
                if (promise) {
                    $interval.cancel(promise);
                }
            });
        });
//    });

function transpose(items) {
    var results = {headers: [], values: []};
    angular.forEach(items, function (value, key) {
        results.headers.push(key);
        angular.forEach(value, function (inner, index) {
            results.values[index] = results.values[index] || [];
            results.values[index].push(inner);
        });
    });
    return results;
}