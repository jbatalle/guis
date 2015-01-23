'use strict';

angular.module('openNaaSApp')
        .controller('SodalesController', function ($scope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, spService) {
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
            
            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                MqNaaSResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = MqNaaSResourceService.query();
                });
            };

            $scope.arn = {endpoint: "http://fibratv.dtdns.net:41080"};
            $scope.openARNDialog = function () {
                $scope.arn = {endpoint: "asdasdsa"};
                ngDialog.open({template: 'partials/sodales/arnDialog.html'});

            };
            $scope.createNetwork = function () {
                var NETWORK = getNETWORK();
                var x2js = new X2JS();
                var json = x2js.xml_str2json(NETWORK);
                console.log(json);
                RootResourceService.put(json).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
            };

            $scope.createTSON = function () {
                var TSON = getTSON();
//                var x2js = new X2JS();
//                var json = x2js.xml_str2json(TSON);
                var json = TSON;
                console.log(json);
                var net = "Network-Internal-1.0-2";
                url = generateUrl("IRootResourceAdministration", net, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, json).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
            };

            $scope.addARN = function (data) {
                console.log("Adding ARN");
                console.log(data);
                var ARN = getARN(data.endpoint);
                console.log(ARN);
                ngDialog.close();
            };

        })
        .controller('InfoMqNaaSResourceController', function ($scope, RootResourceService, $routeParams, localStorageService) {
            RootResourceService.get($routeParams.id).then(function (data) {
                console.log(data);
                console.log("mqEl-" + $routeParams.id);
                $scope.data = data;
                localStorageService.set("mqEl-" + $routeParams.id, data);
                console.log($scope.data);
            });
        });

function generateUrl(action1, resource, action2) {
    var url;
    url = action1 + "/" + resource + "/" + action2;
    return url;
}