'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('PIMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, localStorageService, RootResourceService, NitosService) {
        $rootScope.viewName = 'Dashboard';

        $scope.networkElements = resources.resources;

        localStorageService.set("networkElements", $scope.networkElements);
        console.log(localStorageService.get("networkElements"));

        var nitos = "https://83.212.32.165:8001/resources";

        NitosService.get('resources').then(function (data) {
            console.log(data);
        });

        $scope.getResouceInfo = function (resource, type) {
            $scope.resource = {};
            if (type === 'TSON') {
                $scope.getTsonInfo(resource);
            } else if (type === 'TSON') {

            }
        };

        $scope.getTsonInfo = function (resource) {
            $scope.resource = {};

        };

        $scope.getOfSwitches = function () {
            NitosService.get().then(function (data) {
                console.log(data);
            })
        }

    });
