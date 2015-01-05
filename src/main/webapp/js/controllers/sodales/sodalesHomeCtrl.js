'use strict';

angular.module('openNaaSApp')
        .controller('SodalesHomeCtrl', function ($scope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, spService) {
            var url = generateUrl("IRootResourceAdministration", $routeParams.id, "IRootResourceProvider");
            console.log(url);
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $scope.element = $routeParams.id;
                $scope.data = data;
                localStorageService.set("mqNaaSElements", data);
                console.log($scope.data);
            });
            
            spService.list().then(function (data) {
                $scope.spSize = data.length;
            });


        })