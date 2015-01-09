'use strict';

angular.module('openNaaSApp')
        .controller('sodalesPiMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, spService) {
            var url = "";
            console.log(localStorageService.get("mqNaaSElements"));
//            console.log(JSON.parse(localStorageService.get("mqNaaSElements")));
            localStorageService.set("graphNodes", []);
            console.log($rootScope.networkId);
            RootResourceService.list().then(function (data) {
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                console.log($scope.listNetworks);
                $rootScope.networkId = data[1];
                $scope.selectedNetwork = $rootScope.networkId;
                console.log($rootScope.networkId);
                if (!$rootScope.networkId) {
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
                console.log("GET MQNAAS RESOURCE. SET RESOURCES " + root);
                var url = generateUrl("IRootResourceAdministration", root, "IRootResourceProvider");
                MqNaaSResourceService.list(url).then(function (data) {
                    console.log(data);
                    if (data === undefined)
                        return;
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.networkElements = data;
                    localStorageService.set("networkElements", data);
                    $scope.getRealPorts(root);
                }, function (error) {
                    console.log(error);
                });
            };

            $scope.configureResourceSlices = function (resName) {
                var sliceId = $scope.getSlice(resName);
                var unitId = $scope.createUnit(resName, sliceId, "port");
                var unitId = $scope.setRangeUnit(resName, sliceId);
                var unitId = $scope.setCubes(resName, sliceId);
            };
            $scope.getSlice = function (resourceName) {//get
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/slice");
                MqNaaSResourceService.get(url).then(function (data) {
                    return data;
                });
            };
            $scope.createUnit = function (resourceName, sliceId, content) {//put
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement");
                var content = "port";
                MqNaaSResourceService.put(url, content).then(function (data) {
                    return data;
                });
            };
            $scope.setRangeUnit = function (resourceName, sliceId, unitId, range) {
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement/" + unitId);
                var range = getRangeUnit(1, 2);
                MqNaaSResourceService.put(url, range).then(function (data) {
                    return data;
                });
            };
            $scope.setCubes = function (resourceName, sliceId, cubes) {
                var url = generateUrl("IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes");
                var cubes = getCubeforTSON(1, 2, 3, 4);
                MqNaaSResourceService.put(url, cubes).then(function (data) {
                    return data;
                });
            };

            $scope.getRealPorts = function (resourceName) {
                var xml = "<IResource><IResourceId>port-1</IResourceId><IResourceId>port-2</IResourceId></IResource>";
                var x2js = new X2JS();
                var json = x2js.xml_str2json(xml);
                localStorageService.set("arnPorts", {name: resourceName, ports: json.IResource.IResourceId});
            };
        });