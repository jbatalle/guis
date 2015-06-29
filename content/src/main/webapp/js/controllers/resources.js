'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('openNaaSApp')
    .controller('resourcesListCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, ngTableParams, $filter) {

        if ($routeParams.id == undefined) $rootScope.subNetwork = undefined;
        else $scope.subNetwork = $routeParams.id;

        $rootScope.networkId = "Network-2";

        console.log($rootScope.networkId);
        console.log($scope.subNetwork);
        $scope.data = [];
        $rootScope.viewName = 'List of resources';
        var url = "";
        console.log(localStorageService.get("mqNaaSElements"));
        localStorageService.set("graphNodes", []);
        // $rootScope.networkId = "Network-2";
        //$rootScope.networkId = "Network-2";
        console.log($rootScope.networkId);
        localStorageService.set("networkElements", []);


        $scope.getMqNaaSModel = function (resourceId) {
            console.log("Is not a fucntioN");
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceId + "/IResourceModelReader/resourceModel";
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                if (data === undefined)
                    return;
                $scope.data = checkIfIsArray(data.resource.resources.resource);
                console.log(data);
            });

        };

        $scope.updateSpList = function () {
            var url = "IResourceModelReader/resourceModel";
            MqNaaSResourceService.list(url).then(function (data) {
                if (data === undefined)
                    return;
                $scope.data = checkIfIsArray(data.resource.resources.resource.resources.resource);
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        };

        if ($scope.subNetwork == undefined)
            $scope.updateSpList();
        else
            $scope.getMqNaaSModel($scope.subNetwork);

        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 10, // count per page
            sorting: {
                date: 'desc' // initial sorting
            }
        }, {
            total: $scope.data.length,
            getData: function ($defer, params) {
                var data = checkIfIsArray($scope.data);
                var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: {
                $data: {}
            }
        });

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

        //$scope.getMqNaaSModel();


        $scope.getResourceModel = function (resourceId) {

            $scope.resourceName = resourceId;
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceId + "/IResourceModelReader/resourceModel";

            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.resourceModel = data;
                $scope.resourceResources = data.resource.resources.resource;
            });

            ngDialog.open({
                template: 'partials/resourceModel.html',
                scope: $scope
            });
        };

        $scope.getResourceModelofNitosNetwork = function (resourceId) {

            $scope.resourceName = resourceId;
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + $scope.subNetwork + "/IRootResourceProvider/" + resourceId + "/IResourceModelReader/resourceModel";

            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.resourceModel = data;
                $scope.resourceResources = data.resource.resources.resource;
            });

            ngDialog.open({
                template: 'partials/resourceModel.html',
                scope: $scope
            });
        };




    });