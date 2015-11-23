'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiResourcesCtrl', function ($scope, $rootScope, $window, $modal, MqNaaSResourceService, RootResourceService, arnService, cpeService, $alert, $interval) {
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
                $rootScope.resourceUri = data.resource.descriptor.endpoints.endpoint.uri;
                var req, url;
                if ($scope.type === 'ARN') {
                    arnService.put(getEquipment()).then(function (data) {
                        if (data === null) return;
                        $scope.equipmentInfo = data.response.operation.equipmentList.equipment;
                    });
                    $scope.getARNCards();
                } else if ($scope.type === 'CPE') {
                    url = 'meaPortMapping.xml';
                    cpeService.get(url).then(function (data) {
                        $scope.equipmentInfo = null;
                        var foo = data.meaPortMapping.portMapping;
                        _.each(foo, function (element, index) {
                            var type = "internal";
                            if (parseInt(element.port) > 99 && parseInt(element.port) < 112) type = "external";
                            _.extend(element, {
                                type: type
                            });
                        })
                        $scope.dataCollection = foo;
                    });
                }
            });
        };

        $scope.getEthernetInterfaces = function (id) {
            $scope.dataCollection = [];
            arnService.put(getCardInterfaces(id)).then(function (data) {
                $scope.dataCollection = data.response.operation.interfaceList.interface;
            });
        };

        $scope.cards = [];
        $scope.interfaces = [];

        $scope.getARNCards = function () {
            $scope.cards = [];
            $scope.dataCollection = [];
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
            $modal({
                title: 'CoS information',
                template: 'views/modals/info/cos.html',
                show: true,
                scope: $scope
            });
        };

        $scope.getEthernet = function (ethernet) {
            $scope.ethernet = ethernet;
            $modal({
                title: 'Ethernet information',
                template: 'views/modals/info/ethernetInfo.html',
                show: true,
                scope: $scope
            });
        };
    });
