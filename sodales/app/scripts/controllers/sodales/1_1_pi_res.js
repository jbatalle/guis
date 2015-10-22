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

            //get resource type given Id
            url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + id + '/IResourceModelReader/resourceModel/';
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                $scope.type = data.resource.type;
                var req;
                if ($scope.type === 'ARN') {
                    url = '<?xml version="1.0" encoding="UTF-8"?><request ><operation token="58" type="show" entity="equipment"><equipment id="0"></equipment></operation></request>';
                    arnService.put(req).then(function (data) {
                        if (data === null) return;
                        console.log(data);
                        $scope.equipmentInfo = data.response.operation.equipmentList.equipment;
                    });
                    $scope.getARNCards();
                } else if ($scope.type === 'CPE') {
                    url = 'meaPortMapping.xml';
                    cpeService.get(url).then(function (data) {
                        console.log(data);
                    });
                }
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

        $scope.getARNCards = function () {
            var data = getCards();
            arnService.put(data).then(function (response) {
                console.log(response);
                $scope.cards = response.response.operation.cardList.card;
            });
        };

        //$scope.getResourceInfo();


        $scope.updateARNCard = function () {
            $scope.getEthernetInterfaces($scope.card._id);
        }

        $scope.updateResource = function () {
            $scope.getResourceInfo($scope.resource);
        }

        $scope.showARNCoS = function (CoS) {
            console.log(CoS);
            $scope.cos = CoS;
        };

    });
