'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('HomeCtrl', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, RootResourceService) {
        $rootScope.viewName = 'Dashboard';

        $scope.networkElements = resources.resources;

        localStorageService.set("networkElements", $scope.networkElements);
        console.log(localStorageService.get("networkElements"));
        return;


        var url = "";
        console.log(localStorageService.get("mqNaaSElements"));
        localStorageService.set("graphNodes", []);
        // $rootScope.networkId = "Network-2";
        $rootScope.networkId = "Network-2";
        console.log($rootScope.networkId);
        localStorageService.set("networkElements", []);

        $scope.list = function () {
            RootResourceService.list().then(function (data) {
                if (data.IRootResource.IRootResourceId instanceof Array) {} else {
                    data.IRootResource.IRootResourceId = [data.IRootResource.IRootResourceId];
                }
                $scope.data = data;
                localStorageService.set("mqNaaSElements", data);
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
                MqNaaSResourceService.list(url).then(function (res) {
                    console.log(res);
                    nitRes = res;
                    console.log(data.concat(nitRes.IRootResource.IRootResourceId));
                    localStorageService.set("networkElements", data.concat(nitRes.IRootResource.IRootResourceId));
                    $scope.networkElements = data.concat(nitRes.IRootResource.IRootResourceId);
                });

            }, function (error) {
                console.log(error);
            });

        };

        getMqNaaSResource($rootScope.networkId);


        $scope.getResouceInfo = function (resourceName) {
            $scope.resourceName = resourceName;
            console.log("GET INFO RES");
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/slice";
            console.log(url);
            MqNaaSResourceService.getText(url).then(function (data) {
                console.log(data);
                $scope.getSliceInfo = data;
                $scope.getListUnits(resourceName, data);
            });
        };
        $scope.getListUnits = function (resourceName, slice) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/ISliceProvider/" + slice + "/IUnitManagement";
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.getUnitsList = data.IResource.IResourceId;
            });
        };


        $scope.openUnitDialog = function (unit) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.resourceName + "/ISliceProvider/" + $scope.getSliceInfo + "/IUnitManagement/" + unit;
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.getUnitInfo = data.unit;
            });
            ngDialog.open({
                template: 'partials/resourceInfo.html',
                scope: $scope
            });
        };
    });
