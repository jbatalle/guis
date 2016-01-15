'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('HomeCtrl', function ($scope, $rootScope, localStorageService) {
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



    });
