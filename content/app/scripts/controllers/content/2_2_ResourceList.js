'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:HomeCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('resourcesListCtrl', function ($scope, $rootScope, $stateParams, localStorageService, $modal, $filter) {

        if ($stateParams.id == undefined) $rootScope.subNetwork = undefined;
        else $scope.subNetwork = $stateParams.id;

        $rootScope.networkId = "Network-2";

        //read resources from json file
        console.log(resources);

        console.log(nitos_response)

        if ($scope.subNetwork == undefined)
            $scope.resourcesCollection = resources.resources;
        else
            $scope.getNitosModel($scope.subNetwork);


        $scope.getNitosModel = function () {
            $scope.nitosResourcesCollection = nitos_response.resource_response.resources;

            //get nitos model
        };

        $scope.getResourceModel = function (resourceId) {

            ngDialog.open({
                template: 'partials/resourceModel.html',
                scope: $scope
            });
        };

        $scope.getResourceModelofNitosNetwork = function (resourceId) {

            ngDialog.open({
                template: 'partials/resourceModel.html',
                scope: $scope
            });
        };
    });
