'use strict';

angular.module('mqnaasApp')
    .controller('sodalesPiResourcesCtrl', function ($scope, $rootScope, $window, $modal, arnService, cpeService, $alert, $interval, IMLService) {
        var url = '';

        var resourceId = "";
        $scope.resource = "";
        $scope.resources = [];

        $scope.updateResourceList = function () {
            var url = "phyNetworks"
            IMLService.get(url).then(function (data) {
                if (!data) return;
                $scope.listNetworks = data;
                if ($scope.listNetworks.length === 1) {
                    $rootScope.networkId = '';
                    $window.localStorage.networkId = '';
                }
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[0];
                    $window.localStorage.networkId = JSON.stringify(data[0]);
                }
                url = "phyNetworks/" + $rootScope.networkId.id;
                IMLService.get(url).then(function (data) {
                    $scope.resources = data.phy_resources;
                });
            });
        };
        $scope.updateResourceList();

        $scope.getResourceInfo = function (resource) {
            url = "phyNetworks/" + $rootScope.networkId.id + "/resource/" + resource;
            IMLService.get(url).then(function (data) {
                $scope.type = data.type;
                $rootScope.resourceUri = data.endpoint;
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
                console.log(response);
                $scope.cards = response.response.operation.cardList.card;
            });
        };

        $scope.getARNCard = function (cardId) {
            $scope.cardInfo = [];
            var data = getCard(cardId);
            arnService.put(data).then(function (response) {
                $scope.cardsInfo = response.response.operation.cardList.card;
                var cardInfo = _.filter($scope.cardsInfo, {
                    _id: cardId
                })[0];
                _.extend($scope.card, cardInfo);
            });
        }

        $scope.updateARNCard = function () {
            $scope.getARNCard($scope.card._id);
            $scope.getEthernetInterfaces($scope.card._id);
            $scope.cos = [];
        };

        $scope.updateResource = function () {
            console.log($scope.resource);
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

        $scope.getMoreInfo = function (cardId, interfaceId) {
            var data = getInterfaceOpticalInfo(cardId, interfaceId);
            arnService.put(data).then(function (response) {
                console.log(response.response.operation);
                $scope.interfaceInfo = response.response.operation;
            });
        };
    });