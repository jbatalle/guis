'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
  .controller('listVIController', function ($scope, $rootScope, MqNaaSResourceService, $filter, ngTableParams, viService, localStorageService) {
            console.log("LIST VI");
            $rootScope.networkId = "Network-Internal-1.0-2";//to remove
            
            $scope.data = [];
            $scope.updateSpList = function () {
                var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
                MqNaaSResourceService.list(urlListVI).then(function (result) {
                    console.log(result);
//                    $scope.data = result.IResource.IResourceId;
                    $scope.tableParams.reload();
                });
                viService.list().then(function (result) {
                    console.log(result);
                    $scope.data = result;
                    $scope.tableParams.reload();
                });
            };
            $scope.updateSpList();
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {
                total: $scope.data.length,
                getData: function ($defer, params) {
                    var data = checkIfIsArray($scope.data);
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, $scope: {$data: {}}
            });

            $scope.createVIRequest = function () {
                var urlCreateVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
                MqNaaSResourceService.put(urlCreateVI).then(function (result) {
//                    $scope.data.push(result);
                    var vi = {"name": result, "status": "requested"};
                    viService.createVI(vi);
                    localStorageService.set("virtualElements", []);
                    $scope.updateSpList();
                });
            };
            $scope.deleteVIRequest = function (viReq) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + viReq;
                MqNaaSResourceService.remove(url).then(function (result) {
//                    viService.createVI(vi);
                    $scope.tableParams.reload();
                });
            };

            $scope.sendVIR = function (viReq) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                    viService.updateStatus(viReq, "created");
                });
            };

        })
        .controller('editVIController', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, ngDialog, viService, localStorageService) {
            console.log("Edit VI : " + $routeParams.id);
            $scope.viId = $routeParams.id;
            $scope.virtualPort = [];
//            console.log($scope.$parent.ngDialogData);
            var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
            MqNaaSResourceService.get(urlPeriod).then(function (result) {
                $scope.period = result.period;
                $scope.period.startDate = parseInt($scope.period.startDate * 1000);
                $scope.period.endDate = parseInt($scope.period.endDate * 1000);
            });

            $scope.setPeriod = function (period) {
                var urlPeriod = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestAdministration/period";
                var onPeriod = getPeriod(new Date(period.startDate).getTime() / 1000, new Date(period.endDate).getTime() / 1000);//xml
                MqNaaSResourceService.put(urlPeriod, onPeriod).then(function () {//the response is empty
                });
            };
            $scope.addResourceToVI = function (resourceType) {//resourceType TSON/ARN/CPE...
                console.log("ADD RESOURCE TO VI");
                resourceType = resourceType.toUpperCase();
                console.log(resourceType);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/?arg0=" + resourceType;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resourceRequest = result;
                    viService.addResourceToVI($scope.viId, result, resourceType);
                    var vEl = localStorageService.get("virtualElements");
                    vEl.push({name: result, type: resourceType});
                    localStorageService.set("virtualElements", vEl);
                });
            };
            $scope.addVirtualPortToResource = function (resourceRequest) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceRequest + "/IPortManagement";
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.virtualPort.push(result);
                });
            };
            $scope.mapVirtualResourceToRealResource = function (resourceRequest, realResource) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + resourceRequest + "/IRequestResourceMapping/defineMapping/?arg0=" + resourceRequest + "&arg1=" + realResource;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.mapVirtualPorts = function (virtualPort, realPort) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceMapping/defineMapping/?arg0=" + virtualPort + "&arg1=" + realPort;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.sendVIR = function (viReq) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/?arg0=" + viReq;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                });
            };
            $scope.addResourceToGraph = function (name) {
                console.log($scope.ngDialogData);
                console.log(name);
                createElement(name, $scope.ngDialogData.nodeType.toLowerCase(), $scope.ngDialogData.divPos);
                ngDialog.close();
            };

            $scope.getVirtualPorts = function (virtualRes) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtualRes + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.virtualPorts = result;
                });
            };
            $scope.getPhysicalPorts = function (resourceName) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    $scope.physicalPorts = result;
                });
            };
            $scope.openMappingDialog = function(source, target){
                console.log("FUNCTION IS CALLED");
                console.log(source);
                if(source === undefined || target === undefined){
                    $scope.getListVirtualResources();
                    $scope.getListRealResources();
                } else if(source.indexOf("ARN") !== -1 || source.indexOf("CPE") !== -1 || source.indexOf("TSON") !== -1){
                    $scope.physicalPorts = $scope.getPhysicalPorts(source);
                    $scope.virtualPorts = $scope.getVirtualPorts(target);
                } else {
                    $scope.physicalPorts = $scope.getPhysicalPorts(target);
                    $scope.virtualPorts = $scope.getVirtualPorts(source);
                }
                console.log($scope);
                ngDialog.open({
                    template: 'partials/createVI/mappingPortsDialog.html',
                    scope: $scope
                });
            };
            
            $scope.getListVirtualResources = function() {
                viService.getVIByName($scope.viId).then(function(response){
                    $scope.virtualResources = response.viRes;
                });
            };
            $scope.getListRealResources = function() {
                $scope.physicalResources = localStorageService.get("networkElements");
            };
            
            $scope.physicalPorts = $scope.getPhysicalPorts("ARN-Internal-1.0-3");
            $scope.virtualPorts = $scope.getVirtualPorts("req-1");
        });