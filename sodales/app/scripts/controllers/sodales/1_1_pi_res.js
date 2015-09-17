'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiResourcesCtrl', function ($scope, $rootScope, MqNaaSResourceService, $window, $modal, RootResourceService, arnService, cpeService, $alert, $interval) {
        var url = '';

        var resourceId = "";

        $scope.getResourceInfo = function (id) {
            var req = '<?xml version="1.0" encoding="UTF-8"?><request ><operation token="58" type="show" entity="equipment"><equipment id="0"></equipment></operation></request>';
            arnService.put(req).then(function (data) {
                console.log(data);
                $scope.equipmentInfo = data.response.operation.equipmentList.equipment;
            });
        };

        $scope.getEthernetInterfaces = function (id) {
            var req = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="all"><interface equipmentId="0" cardId="3"/></operation></request>';
            arnService.put(req).then(function (data) {
                console.log(data);
                $scope.dataCollection = data.response.operation.interfaceList.interface;
            });
        };

        $scope.getResourceInfo();
        $scope.getEthernetInterfaces();

    });
