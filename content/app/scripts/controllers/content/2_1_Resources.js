'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('PIMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, RootResourceService) {
        $rootScope.viewName = 'Dashboard';

        $scope.networkElements = resources.resources;

        localStorageService.set("networkElements", $scope.networkElements);
        console.log(localStorageService.get("networkElements"));
        return;


        var url = "";

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
            $modal({
                template: 'partials/resourceInfo.html',
                scope: $scope
            });
        };
    });
