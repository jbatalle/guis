'use strict';

angular.module('mqnaasApp')
    .controller('spController', function ($scope, $rootScope, IMLService, $filter, spService, AuthService, $interval, $q) {
        $rootScope.spName = "SP1";
        $scope.data = [];
        $rootScope.networkCollection = [];

        $rootScope.networkId = "Network-Internal-1.0-2";

        $scope.updateViList = function () {
            var url = "viNetworks"
            IMLService.get(url).then(function (result) {
                var currentRequest = 1;
                var availableViNets = [];
                var deferred = $q.defer();
                $scope.physicalNetworks = result;
                makeNextRequest();
                /*$scope.physicalNetworks = result;
                var currentRequest = 1;
                var availableViNets = [];
                var deferred = $q.defer();
                makeNextRequest();

                function makeNextRequest() {
                    var phyNet = $scope.physicalNetworks[currentRequest];
                    var url = "viNetworks/"+phyNet;
                    var url = "IRootResourceAdministration/" + phyNet + "/IRequestBasedNetworkManagement";
                    MqNaaSResourceService.list(url).then(function (result) {*/
                function makeNextRequest() {
                    var viNets = result;
                    AuthService.profile().then(function (data) {
                        spService.get(data.sp_id).then(function (data) {
                            angular.forEach(_.without(viNets, _.pluck(data, 'name')), function (viNet) {
                                var url = "viNetworks/" + viNet.id;
                                IMLService.get(url).then(function (viInfo) {
                                    if (!viInfo) return;
                                    currentRequest++;
                                    availableViNets.push(viNet);
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
                }
            });

            //});
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
