'use strict';

angular.module('openNaaSApp')
        .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, spService) {
var url = "";
            console.log(localStorageService.get("mqNaaSElements"));
//            console.log(JSON.parse(localStorageService.get("mqNaaSElements")));
localStorageService.set("graphNodes", []);

            RootResourceService.list().then(function (data) {
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                console.log($scope.listNetworks);
                $rootScope.networkId = data[1];
                console.log($rootScope.networkId);
                if(!$rootScope.networkId){
                    console.log("Clean localStorage networkElements due network is not created.");
                    localStorageService.set("networkElements", []);
                }
                getMqNaaSResource($rootScope.networkId);
//                localStorageService.set("mqNaaSElements", data);
            });

            $scope.list = function () {
                RootResourceService.list().then(function (data) {
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                    } else {
                        data.IRootResource.IRootResourceId = [data.IRootResource.IRootResourceId];
                    }
                    $scope.data = data;
                    localStorageService.set("mqNaaSElements", data);
                });
            }

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $rootScope.networkId = data;
                    $scope.list();
                });
            };

            $scope.arn = {network: "", endpoint: "http://fibratv.dtdns.net:41080"};
            $scope.cpe = {endpoint: "http://fibratv.dtdns.net:41081"};
/*            $scope.openARNDialog = function () {
                $scope.arn = {endpoint: "asdasdsa"};
                ngDialog.open({template: 'partials/sodales/arnDialog.html'});

            };*/

            $scope.createTSON = function () {
                var TSON = getResource("TSON");
                var json = TSON;
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, json).then(function (data) {
                    $scope.data = data;
                });
            };

            $scope.addARN = function (data) {
                var ARN = getResource("ARN", data.endpoint);
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, ARN).then(function (data) {
                    $scope.dataARN = data;
                    createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                });
                ngDialog.close();
            };
            
            $scope.addCPE = function (data) {
                var CPE = getResource("CPE", data.endpoint);
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, CPE).then(function (data) {
                    $scope.dataCPE = data;
                    createElement(data, $scope.ngDialogData.nodeType, $scope.ngDialogData.divPos);
                });
                ngDialog.close();
            };
            
            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                MqNaaSResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = MqNaaSResourceService.query();
                });
            };
            
            var getMqNaaSResource = function (root, url) {
                console.log("GET MQNAAS RESOURCE. SET RESOURCES "+root);
                var url = generateUrl("IRootResourceAdministration", root, "IRootResourceProvider");
                MqNaaSResourceService.list(url).then(function (data) {
                    console.log(data);
                    if (data === undefined)
                        return;
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.networkElements = data;
                    localStorageService.set("networkElements", data);
                }, function (error) {
                    console.log(error);
                });
            };
        });