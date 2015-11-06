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
                $scope.resources = checkIfIsArray(data.IRootResource.IRootResourceId);
            });
        };
        $scope.updateResourceList();

        $scope.getResourceInfo = function (id) {
            //get resource type given Id
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + id + '/IResourceModelReader/resourceModel/';
            MqNaaSResourceService.get(url).then(function (data) {
                $scope.type = data.resource.type;
                var req, url;
                if ($scope.type === 'ARN') {
                    req = '<?xml version="1.0" encoding="UTF-8"?><request ><operation token="58" type="show" entity="equipment"><equipment id="0"></equipment></operation></request>';
                    arnService.put(req).then(function (data) {
                        if (data === null) return;
                        console.log(data);
                        $scope.equipmentInfo = data.response.operation.equipmentList.equipment;
                    });
                    $scope.getARNCards();
                } else if ($scope.type === 'CPE') {
                    url = 'meaPortMapping.xml';
                    cpeService.get(url).then(function (data) {
                        $scope.equipmentInfo = null;
                        console.log(data);
                        $scope.dataCollection = data.meaPortMapping.portMapping;
                    });
                }
            });
        };

        $scope.getEthernetInterfaces = function (id) {
            var req = '<?xml version="1.0" encoding="UTF-8"?><request><operation token="1" type="show" entity="all"><interface equipmentId="0" cardId="' + id + '"/></operation></request>';
            arnService.put(req).then(function (data) {
                $scope.dataCollection = data.response.operation.interfaceList.interface;
            });
        };

        $scope.cards = [];
        $scope.interfaces = [];

        $scope.getARNCards = function () {
            var data = getCards();
            arnService.put(data).then(function (response) {
                $scope.cards = response.response.operation.cardList.card;
            });
        };

        $scope.updateARNCard = function () {
            $scope.getEthernetInterfaces($scope.card._id);
            $scope.cos = [];
        };

        $scope.updateResource = function () {
            $scope.getResourceInfo($scope.resource);
        };

        $scope.showARNCoS = function (CoS) {
            $scope.cos = CoS;
        };

        $scope.getEthernet = function (ethernet) {
            $scope.ethernet = ethernet;
            $modal({
                title: 'Ethernet information',
                template: 'views/modals/ethernetInfo.html',
                show: true,
                scope: $scope
            });
        };
    });
