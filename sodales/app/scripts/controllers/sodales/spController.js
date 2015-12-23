'use strict';

angular.module('mqnaasApp')
    .controller('spController', function ($scope, $rootScope, IMLService, $filter, spService, AuthService, $interval, $q) {
        $rootScope.spName = "SP1";
        $scope.data = [];
        $rootScope.networkCollection = [];

        $rootScope.networkId = "Network-Internal-1.0-2";

        $scope.updateViList = function () {
            var url = "viNetworks"
            AuthService.profile().then(function (data) {
                var providerId = data.sp_id;
                spService.get(providerId).then(function (providerInfo) {
                    IMLService.get(url).then(function (result) {
                        var currentRequest = 0;
                        var availableViNets = [];
                        var deferred = $q.defer();
                        $scope.providersVis = providerInfo.vis;
                        makeNextRequest();

                        function makeNextRequest() {
                            var url = "viNetworks/" + $scope.providersVis[currentRequest].name;
                            IMLService.get(url).then(function (viInfo) {
                                if (!viInfo) return;
                                if (viInfo.period.period_end * 1000 < new Date().getTime()) {
                                    viInfo.disabled = true;
                                }
                                currentRequest++;
                                availableViNets.push(viInfo);
                                if (currentRequest < $scope.providersVis.length) {
                                    makeNextRequest();
                                } else {
                                    $scope.networkCollection = availableViNets;
                                    $scope.displayedCollection = [].concat($scope.networkCollection)
                                    deferred.resolve();
                                }
                            });
                        }
                    });
                });
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
