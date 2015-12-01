'use strict';

angular.module('mqnaasApp')
    .controller('spController', function ($scope, $rootScope, MqNaaSResourceService, $filter, spService, AuthService, $interval, $q) {
        $rootScope.spName = "SP1";
        $scope.data = [];
        $rootScope.networkCollection = [];

        $rootScope.networkId = "Network-Internal-1.0-2";

        $scope.updateViList = function () {
            var url = "IRootResourceProvider";
            MqNaaSResourceService.list(url).then(function (result) {
                $scope.physicalNetworks = checkIfIsArray(result.IRootResource.IRootResourceId);
                var currentRequest = 1;
                var availableViNets = [];
                var deferred = $q.defer();
                makeNextRequest();

                function makeNextRequest() {
                    var phyNet = $scope.physicalNetworks[currentRequest];
                    var url = "IRootResourceAdministration/" + phyNet + "/IRequestBasedNetworkManagement";
                    MqNaaSResourceService.list(url).then(function (result) {
                        var viNets = checkIfIsArray(result.IRootResource.IRootResourceId);
                        AuthService.profile().then(function (data) {
                            spService.get(data.sp_id).then(function (data) {
                                angular.forEach(_.without(viNets, _.pluck(data, 'name')), function (viNet) {
                                    var urlVirtNets = 'IRootResourceAdministration/' + phyNet + '/IRequestBasedNetworkManagement/' + viNet + '/IResourceModelReader/resourceModel';
                                    MqNaaSResourceService.list(urlVirtNets).then(function (viInfo) {
                                        if (!viInfo) return;
                                        currentRequest++;
                                        availableViNets.push({
                                            id: viNet,
                                            physicalNetwork: phyNet,
                                            created_at: viInfo.resource.attributes.entry.value
                                        });
                                        if (currentRequest < $scope.physicalNetworks.length) {
                                            makeNextRequest();
                                        } else {
                                            $scope.networkCollection = availableViNets;
                                            $scope.displayedCollection = [].concat($scope.networkCollection)
                                            deferred.resolve();
                                        }
                                    });
                                })
                            })
                        });
                    });
                }
            });
        };

        $scope.updateViList();
        var promise = $interval(function () {
            $scope.updateViList();
        }, 5000);


        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });

    });
