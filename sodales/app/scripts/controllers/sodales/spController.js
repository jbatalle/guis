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

    })
    .controller('spVIController', function ($scope, $rootScope, MqNaaSResourceService, $stateParams, localStorageService, $modal) {
        console.log("Edit VI : " + $stateParams.id);
        $rootScope.virtNetId = $stateParams.id;
        $scope.virtualPort = [];
        $scope.virtualResources = [];

        $scope.getNetworkResources = function () {
            console.log("NETWORK GET RESOURCE");
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider";
            MqNaaSResourceService.get(url).then(function (result) {
                console.log(result);
                var netEls = checkIfIsArray(result.IRootResource.IRootResourceId);
                localStorageService.set("virtualElements", netEls);
                $scope.networkRes = result.IRootResource.IRootResourceId;

                netEls.forEach(function (element) {
                    // $scope.getRealPorts(element);
                });
            });
        };
        $scope.getNetworkResources();
        $scope.createOperation = function () {
            $modal({
                template: 'partials/sodales/sp/arnOpDialog.html',
                scope: $scope
            });
        };
        $scope.openOperationARNDialog = function (resourceName, type) {
            console.log("Dialog call");
            $scope.virtualResourceOp = resourceName;
            $scope.arn = new Object;
            $modal({
                template: 'views/sodales/sp/arnOpDialog.html',
                scope: $scope
            });
        };

        $scope.openOperationCPEDialog = function (resourceName, type) {
            $scope.virtualResourceOp = resourceName;
            $scope.cpe = new Object;
            $modal({
                template: 'partials/sodales/sp/cpeOpDialog.html',
                scope: $scope
            });
        };

        $scope.getListVirtualResources = function () {
            /* viNetService.getVIByName($scope.viId).then(function (response) {
                 $scope.virtualResources = response.viRes;
             });*/
        };
        $scope.getListRealResources = function () {
            $scope.physicalResources = localStorageService.get("networkElements");
        };

        $scope.Configure = function (type, form) {
            console.log(type);
            if (type === "arn") {
                console.log(form);
                var arn = form;
                var data = getARNVlanConnectivity(arn.upLinkIfaces1, arn.upLinkIfaces2, arn.downLinkIfaces1, arn.downLinkIfaces2, arn.upLinkVlan, arn.downLinkVlan);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});

            } else if (type === "cpe") {
                console.log(form);
                var cpe = form;
                var data = getCPEVlanConnectivity(cpe.egressPortId, cpe.egressVlan, cpe.ingressPortId, cpe.ingressVlan, cpe.unitId);
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $scope.virtNetId + "/IRootResourceProvider/" + $scope.virtualResourceOp + "/IVlanConnectivity/vlanConnectivity";
                MqNaaSResourceService.put(url, data).then(function (result) {});
            }
            $rootScope.info = "200 - Operation done";
            this.$hide();
        };


        $scope.getRealPorts = function (virtualResource) {
            //$rootScope.virtualResource = "ARN-Internal-1.0-11";
            $scope.realPorts = [];
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/IPortManagement";
            MqNaaSResourceService.get(url).then(function (result) {
                var ports = checkIfIsArray(result.IResource.IResourceId);
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/slice";
                MqNaaSResourceService.getText(url).then(function (result) {
                    var slice = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/" + slice + "/ISliceAdministration/cubes";
                    MqNaaSResourceService.get(url).then(function (result) {
                        console.log(result);
                        var cubes = checkIfIsArray(result.cubesList.cubes);
                        console.log(cubes);
                        cubes.forEach(function (cube) {
                            console.log(cube);
                            if (cube.cube.ranges.range.lowerBound === cube.cube.ranges.range.upperBound) {
                                $scope.realPorts.push(ports[cube.cube.ranges.range.lowerBound]);
                            } else {
                                var k = cube.cube.ranges.range.lowerBound;
                                while (k < cube.cube.ranges.range.upperBound) {
                                    $scope.realPorts.push(ports[cube.cube.ranges.range.lowerBound]);
                                    k++;
                                }
                            }
                        });
                    });
                });
            });
        };

    });
