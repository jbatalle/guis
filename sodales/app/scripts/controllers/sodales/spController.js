'use strict';

angular.module('mqnaasApp')
    .controller('spController', function ($scope, $rootScope, MqNaaSResourceService, $filter, spService, localStorageService, AuthService) {
        console.log("sp");
        $rootScope.networkId = localStorageService.get("networkId");
        $rootScope.spName = "SP1";
        $scope.data = [];
        $rootScope.networkCollection = [];

        $rootScope.networkId = "Network-Internal-1.0-2";

        AuthService.profile().then(function (data) {
            console.log(data);
            //get vi nets ids
            spService.get(data.sp_id).then(function (data) {
                console.log(data);
                $scope.networks = data.vis;
                data.vis.forEach(function (viNet) {
                    console.log(viNet);

                    var url = "IRootResourceProvider";
                    MqNaaSResourceService.list(url).then(function (result) {
                        var physicalNetworks = checkIfIsArray(result.IRootResource.IRootResourceId);
                        console.log(physicalNetworks);

                        physicalNetworks.forEach(function (phyNet) {
                            var urlVirtNets = 'IRootResourceAdministration/' + phyNet + '/IRequestBasedNetworkManagement/' + viNet.name + '/IResourceModelReader/resourceModel';
                            MqNaaSResourceService.list(urlVirtNets).then(function (viInfo) {
                                console.log(viInfo);
                                if (!viInfo) return;
                                $rootScope.networkCollection.push({
                                    id: viNet.name,
                                    physicalNetwork: phyNet,
                                    created_at: viInfo.resource.attributes.entry.value
                                });
                            });
                        })
                    });
                });
            });

        });

        $scope.updateSpList = function () {
            /*spService.list().then(function (data) {
                console.log(data);
            });*/
            var urlListVI = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement";
            MqNaaSResourceService.list(urlListVI).then(function (result) {
                console.log(result);
                //                    $scope.data = result.IResource.IResourceId;
            });

        };
        $scope.updateSpList();

    });
