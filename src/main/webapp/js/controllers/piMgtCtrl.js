'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
        .controller('PIMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService) {
            var url = "";
            console.log(localStorageService.get("mqNaaSElements"));
//            console.log(JSON.parse(localStorageService.get("mqNaaSElements")));
            localStorageService.set("graphNodes", []);
            $rootScope.networkId = "Network-2";
            console.log($rootScope.networkId);
            localStorageService.set("networkElements", []);

            $scope.list = function () {
                RootResourceService.list().then(function (data) {
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                    } else {
                        data.IRootResource.IRootResourceId = [data.IRootResource.IRootResourceId];
                    }
                    $scope.data = data;
                    localStorageService.set("mqNaaSElements", data);
                });
            };

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $rootScope.networkId = data;
                    $scope.list();
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
                    var url = generateUrl("IRootResourceAdministration", root, "IRootResourceAdministration/Network-nitos-3/IRootResourceProvider");
                    var nitRes = [];
                    MqNaaSResourceService.list(url).then(function(res){nitRes = res;
                    console.log(data.concat(nitRes.IRootResource.IRootResourceId));
                    localStorageService.set("networkElements", data.concat(nitRes.IRootResource.IRootResourceId));
                $scope.networkElements = data.concat(nitRes.IRootResource.IRootResourceId);});
                    
                }, function (error) {
                    console.log(error);
                });
                
            };

getMqNaaSResource($rootScope.networkId);
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

        });