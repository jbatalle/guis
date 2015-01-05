'use strict';

angular.module('openNaaSApp')
        .controller('sodalesPiMgtCtrl', function ($scope, MqNaaSResourceService, $routeParams, localStorageService, ngDialog, RootResourceService, spService) {
var url = "";
            console.log(localStorageService.get("mqNaaSElements"));
            RootResourceService.list().then(function (data) {
                console.log(data);
                $scope.networkId = data.IRootResource.IRootResourceId[1];
                console.log($scope.networkId);

                localStorageService.set("mqNaaSElements", data);
                console.log($scope.data);
            });

            $scope.list = function () {
                RootResourceService.list().then(function (data) {
                    if (data.IRootResource.IRootResourceId instanceof Array) {
                    } else {
                        data.IRootResource.IRootResourceId = [data.IRootResource.IRootResourceId];
                    }
                    $scope.data = data;
                    localStorageService.set("mqNaaSElements", data);
                });
            }

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $scope.networkId = data;
                    console.log($scope.data);
                    $scope.list();
                });
            };

            $scope.arn = {endpoint: "http://fibratv.dtdns.net:41080"};
            $scope.openARNDialog = function () {
                $scope.arn = {endpoint: "asdasdsa"};
                ngDialog.open({template: 'partials/sodales/arnDialog.html'});

            };

            $scope.createTSON = function () {
                var TSON = getResource("TSON");
//                var x2js = new X2JS();
//                var json = x2js.xml_str2json(TSON);
                var json = TSON;
                console.log(json);
                var net = "Network-Internal-1.0-2";
                url = generateUrl("IRootResourceAdministration", $scope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, json).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
            };

            $scope.addARN = function (data) {
                console.log("Adding ARN");
                console.log(data);
                console.log($scope.networkId);
                var ARN = getResource("ARN", data.endpoint);
                console.log(ARN);
                url = generateUrl("IRootResourceAdministration", $scope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, ARN).then(function (data) {
                    console.log(data);
                    $scope.dataARN = data;
                    console.log($scope.data);
                });
                ngDialog.close();
            };
            
            $scope.addACPE = function (data) {
                console.log("Adding CPE");
                console.log(data);
                var CPE = getResource("CPE", data.endpoint);
                console.log(CPE);
                url = generateUrl("IRootResourceAdministration", $scope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, CPE).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
                ngDialog.close();
            };

        });