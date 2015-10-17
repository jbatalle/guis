'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiResourcesCtrl', function ($scope, $rootScope, MqNaaSResourceService, $window, $modal, RootResourceService, arnService, cpeService, $alert, $interval) {
        var url = '';

        var resourceId = "";
        $scope.resource = "";
        $scope.resources = [];

        $scope.updateResourceList = function () {
            url = generateUrl('IRootResourceAdministration', $rootScope.networkId, 'IRootResourceProvider');
            MqNaaSResourceService.list(url).then(function (data) {
                console.log(data);

                $scope.resources = checkIfIsArray(data.IRootResource.IRootResourceId);
            });
        };
        $scope.updateResourceList();


        $scope.getResourceInfo = function (id) {
            var req = '<?xml version="1.0" encoding="UTF-8"?><request ><operation token="58" type="show" entity="equipment"><equipment id="0"></equipment></operation></request>';
            arnService.put(req).then(function (data) {
                console.log(data);
                $scope.equipmentInfo = data.response.operation.equipmentList.equipment;
            });
        };

        $scope.getEthernetInterfaces = function (id) {
            var req = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="all"><interface equipmentId="0" cardId="' + id + '"/></operation></request>';
            arnService.put(req).then(function (data) {
                console.log(data);
                $scope.dataCollection = data.response.operation.interfaceList.interface;
            });
        };

        $scope.cards = [];
        $scope.interfaces = [];

        $scope.getCards = function () {
            var data = getCards();
            arnService.put(data).then(function (response) {
                console.log(response);
                $scope.cards = response.response.operation.cardList.card;
            });
        };

        //$scope.getResourceInfo();
        $scope.getCards();

        $scope.updateCard = function () {
            $scope.getEthernetInterfaces($scope.card._id);
        }

        $scope.updateResource = function () {
            $scope.getResourceInfo($scope.resource);
        }

        $scope.showCoS = function (CoS) {
            console.log(CoS);
            $scope.cos = CoS;
        };

    });
