'use strict';

angular.module('openNaaSApp')
        .controller('SodalesMonitoringController', function ($scope, ngTableParams, $filter, $routeParams, localStorageService, ngDialog, arnService, cpeService) {

            $scope.selectedResource = function (resourceId) {
                //get statistics and send to scope
                console.log("Selected " + resourceId);
                if (resourceId === 'CPE') {
                    $scope.CPEactive = "active";
                    $scope.ARNactive = "";
                    $scope.ARNStats = false;
                    $scope.CPEStats = true;
                    $scope.getCPEPortList();
                }/*if (resourceId === 'ARN') {*/
                else{
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