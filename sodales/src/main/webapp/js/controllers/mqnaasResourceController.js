'use strict';

angular.module('openNaaSApp')
        .controller('MqNaaSResourceController', function ($scope, MqNaaSResourceService, $routeParams, localStorageService) {
            var url = generateUrl("IRootResourceAdministration", $routeParams.id, "IRootResourceProvider");
            console.log(url);
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);
                $scope.element = $routeParams.id;
                $scope.data = data;
                localStorageService.set("mqNaaSElements", data);
                console.log($scope.data);
            });

            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                MqNaaSResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = MqNaaSResourceService.query();
                });
            };
            $scope.create = function () {
                var json = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:rootResourceDescriptor xmlns:ns2="org.mqnaas"><specification><type>NETWORK</type><model>Internal</model><version>1.0</version></specification></ns2:rootResourceDescriptor>';
//            json = '<?xml version="1.0" encoding="utf-8"?><request><operation token="0" type="show" entity="equipment"><equipment id="0" /></operation></operation></request>';
                var x2js = new X2JS();
                json = x2js.xml_str2json(json);
                console.log(json);
                RootResourceService.put(json).then(function (data) {
                    $scope.data = data;
                    console.log($scope.data);
                });
                ;
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