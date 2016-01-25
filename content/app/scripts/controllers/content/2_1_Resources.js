'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('PIMgtCtrl', function ($scope, $rootScope, localStorageService, NitosService) {
        $rootScope.viewName = 'Dashboard';

        var phyResources = resources.resources;
        //$scope.test = resources.resources;;
        //
        $scope.networkElements = resources.resources;

        localStorageService.set("networkElements", $scope.networkElements);
        console.log(localStorageService.get("networkElements"));

        var nitos = "https://83.212.32.165:8001/resources";

        NitosService.get('resources').then(function (data) {
            console.log(data);
        });

        $scope.getResouceInfo2 = function (resource, type) {
            $rootScope.phyResource = {};
            if (type === 'TSON') {
                $scope.getTsonInfo(resource);
            } else if (type !== 'TSON') {

            }
        };

        $scope.getOfSwitches = function () {
            NitosService.get().then(function (data) {
                console.log(data);
            })
        };

        $scope.getResourceInfo = function (d) {
            console.log(d.id);
            console.log(phyResources)
            console.log($rootScope.phyResource);
            console.log($scope.networkElements);
            $rootScope.phyResource = undefined;
            $rootScope.phyResource = $scope.networkElements.filter(function (res) {
                return d.id === res.id
            })[0];
            console.log($rootScope.phyResource);
            //$scope.resource = d;
        }

        $scope.getJSONModel = function (d) {
            console.log(d.id);
            console.log(phyResources)
            console.log($rootScope.phyResource);
            console.log($scope.networkElements);
            
            $rootScope.phyResource = undefined;
            $rootScope.phyResource = $scope.networkElements.filter(function (res) {
                return d.id === res.id
            })[0];
            $scope.jsonObj = JSON.stringify($rootScope.phyResource, undefined, 4);

        };

    });
