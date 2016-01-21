'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('resourcesListCtrl', function ($scope, $rootScope, $stateParams, localStorageService, $modal, $filter, NitosService, TsonService) {

        if ($stateParams.id == undefined) $rootScope.subNetwork = undefined;
        else $scope.subNetwork = $stateParams.id;

        $rootScope.networkId = "Network-2";

        //read resources from json file
        console.log(resources);

        console.log(nitos_response)

        if ($scope.subNetwork == undefined)
            $scope.resourcesCollection = resources_list.resources;
        else
            $scope.getNitosModel($scope.subNetwork);


        $scope.getNitosModel = function () {
            $scope.nitosResourcesCollection = [];
            NitosService.get('resources').then(function (data) {
                console.log(data);
                angular.forEach(data.resource_response.resources, function (res) {
                        //$scope.nitosResourcesCollection.push(res);
                        if (res.resource_type === 'epc' || res.resource_type === 'enodeb' || res.resource_type === 'openflowswitch' || res.resource_type === 'node') $scope.nitosResourcesCollection.push(res);
                    })
                    //$scope.nitosResourcesCollection = data.resource_response.resources;
                    //ng-if="row.resource_type === 'epc'"
            });
            // $scope.nitosResourcesCollection = nitos_response.resource_response.resources;

            //get nitos model
        };

        $scope.getResourceModel = function (data) {
            data.info = {};
            TsonService.get(data.endpoint).then(function (response) {
                data.info = response.Request;
                $scope.resource = data;
                $scope.jsonObj = JSON.stringify(data, undefined, 4);
                console.log($scope.jsonObj)
                $modal({
                    title: "Resource descriptor - " + data.id,
                    content: JSON.stringify(data, undefined, 4),
                    template: "views/modals/info/info.html",
                    show: true,
                    scope: $scope,
                });
            })
        };

        $scope.getResourceModelofNitosNetwork = function (data) {
            $scope.resource = data;
            $scope.jsonObj = JSON.stringify(data, undefined, 4);
            $modal({
                title: "Resource descriptor - " + data.name,
                content: JSON.stringify(data, undefined, 4),
                template: "views/modals/info/info.html",
                show: true,
                scope: $scope,
            });
        };
    });
