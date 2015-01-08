'use strict';

angular.module('openNaaSApp')
        .controller('SodalesMonitoringController', function ($scope, ngTableParams, $filter, $routeParams, localStorageService, ngDialog, arnService, cpeService) {

            $scope.dropdown = [{ "text": "CFM/OAM", "click": "selectedResource('CFM/OAM')"}];
            $scope.selectedResource = function (resourceId) {
                //get statistics and send to scope
                console.log("Selected " + resourceId);
                if (resourceId === 'CPE') {
                    $scope.CPEactive = "active";
                    $scope.ARNactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = true;
                    $scope.getCPEPortList();
                }
                if (resourceId === 'CFM/OAM') {
                    $scope.CPEactive = "active";
                    $scope.ARNactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = false;
                    $scope.CFM_OAM = true;
                    $scope.getCCM();
                    $scope.getLBM();
                    $scope.getDMM();
                }/*if (resourceId === 'ARN') {*/
                else {
                    $scope.ARNactive = "active";
                    $scope.CPEactive = "";
                    $scope.ARNStats = true;
                    $scope.CPEStats = false;
                    $scope.getARNStats();
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
                var reqListPortsUrl = "meaPortMapping.xml?unit=0";
                cpeService.get(reqListPortsUrl).then(function (response) {
                    $scope.cpePortList = response.meaPortMapping.portMapping;
                });
            };
            $scope.getCPEStats = function (portId) {
                var reqUrl = "meaPmCounter.xml?unit=0&pmId=" + portId;
                cpeService.get(reqUrl).then(function (response) {
                    var data = response.meaPmCounter.PmCounter;
                    $scope.content = data;
                });
            };

            $scope.getCCM = function (portId) {
                var reqUrl = "meaGetCcmDefectState.xml?unit=0&streamId=1";
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaCcmCounter xmlns="http://www.ethernity-net.com/enet/CcmCounter"><CcmDefectCount><unit>0</unit><LastSequenc>1832557</LastSequenc><Unexpected_MEG_ID>0</Unexpected_MEG_ID><Unexpected_MEP_ID>0</Unexpected_MEP_ID><reorder>4</reorder><eventLoss>0</eventLoss></CcmDefectCount></meaCcmCounter>';
                var x2js = new X2JS();
                var json = x2js.xml_str2json(xml);
                $scope.ccmCounter = json.meaCcmCounter.CcmDefectCount;
                console.log(json);
                var data = json.meaCcmCounter.CcmDefectCount;
                console.log(data);

                /*                cpeService.get(reqUrl).then(function (response) {
                 var data = response.meaCcmCounter.CcmDefectCount;
                 $scope.ccmCounter = data.meaCcmCounter.CcmDefectCount;
                 });
                 */
            };
            $scope.getLBM = function (portId) {
                var reqUrl = "meagetLBMStatistics.xml?unit=0&streamId=1";
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>0</AVG_latency><Bytes>1735000</Bytes><MAX_jitter>0</MAX_jitter><MIN_jitter>4294967295</MIN_jitter><Pkts>1735</Pkts><drop>0</drop><lastseqID>1754</lastseqID><num_Of_Bits_Error>6695669</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
                var x2js = new X2JS();
                var json = x2js.xml_str2json(xml);
                $scope.lbmCounter = json.meaStatistics.lbmDmmStatistics;
                console.log(json.meaStatistics.lbmDmmStatistics);
/*                cpeService.get(reqUrl).then(function (response) {
                    var data = response.meaCcmCounter.CcmDefectCount;
                    $scope.lbmCounter = data;
                });*/
            };
            $scope.getDMM = function (portId) {
                var reqUrl = "meaGetDmmStatistics.xml?unit=0&streamId=1";
                var xml = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/css" href=="olg_rss.css" ?><meaStatistics xmlns="http://www.ethernity-net.com/enet/LbmDmmStatistics"><lbmDmmStatistics><unit>0</unit><AVG_latency>5408</AVG_latency><Bytes>0</Bytes><MAX_jitter>6240</MAX_jitter><MIN_jitter>5312</MIN_jitter><Pkts>0</Pkts><drop>0</drop><lastseqID>0</lastseqID><num_Of_Bits_Error>0</num_Of_Bits_Error><seq_ID_err>0</seq_ID_err><seq_ID_reorder>0</seq_ID_reorder></lbmDmmStatistics></meaStatistics>';
                var x2js = new X2JS();
                var json = x2js.xml_str2json(xml);
                $scope.dmmCounter = json.meaStatistics.lbmDmmStatistics;
                console.log(json.meaStatistics.lbmDmmStatistics);
/*                cpeService.get(reqUrl).then(function (response) {
                    var data = response.meaPmCounter.PmCounter;
                    $scope.dmmCounter = data.meaStatistics.lbmDmmStatistics;
                });
                */
            };

            $scope.viewStatistics = function (interfaceId) {
                $scope.infId = interfaceId;
                ngDialog.open({
                    template: 'partials/sodales/counterStats.html',
                    controller: 'statisticsCtrl',
                    scope: $scope}
                );
            };
            $scope.selectedResource("ARN");
        })
        .controller('statisticsDialogCtrl', function ($scope, ngTableParams, $filter, localStorageService, arnService) {
            var requestData = getCounter($scope.infId);
            arnService.put(requestData).then(function (response) {
                var data = response.response.operation.interfaceList.interface.ethernet.counters;
//                data = {"tx": {"_dropEvents": "1", "_octets": "2", "_packets": "3", "_broadcastPackets": "4", "_multicastPackets": "0", "_crcAlignErrors": "0", "_undersizePackets": "0", "_oversizePackets": "0", "_fragments": "0", "_jabbers": "0", "_collisions": "0", "_packets64Octets": "0", "_packets65to127Octets": "0", "_packets128to255Octets": "0", "_packets256to511Octets": "0", "_packets512to1023Octets": "0", "_packets1024to1518Octets": "0", "_throughput": "0"}, "rx": {"_dropEvents": "21", "_octets": "22", "_packets": "23", "_broadcastPackets": "24", "_multicastPackets": "0", "_crcAlignErrors": "0", "_undersizePackets": "0", "_oversizePackets": "0", "_fragments": "0", "_jabbers": "0", "_collisions": "0", "_packets64Octets": "0", "_packets65to127Octets": "0", "_packets128to255Octets": "0", "_packets256to511Octets": "0", "_packets512to1023Octets": "0", "_packets1024to1518Octets": "0", "_throughput": "0"}};
                data = transpose(data);
                $scope.content = data;
            });

            /*            $scope.tableParams = new ngTableParams({
             page: 1, // show first page
             count: 10, // count per page
             sorting: {
             date: 'desc'     // initial sorting
             }
             }, {
             
             getData: function($defer, params) {
             var requestData = getCounter($scope.infId);
             arnService.put(requestData).then(function(response) {
             var data = response.response.operation.interfaceList.interface.ethernet.counters;
             console.log(data);
             $scope.content = data;
             //                    data = '{"_dropEvents":"0","_octets":"0","_packets":"0","_broadcastPackets":"0","_multicastPackets":"0","_crcAlignErrors":"0","_undersizePackets":"0","_oversizePackets":"0","_fragments":"0","_jabbers":"0","_collisions":"0","_packets64Octets":"0","_packets65to127Octets":"0","_packets128to255Octets":"0","_packets256to511Octets":"0","_packets512to1023Octets":"0","_packets1024to1518Octets":"0","_throughput":"0"}';
             params.total(data.length);
             $defer.resolve(data);
             
             //                    console.log(data);
             //                    var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
             //                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
             })
             },
             $scope: {$data: {}}
             });*/
        })
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