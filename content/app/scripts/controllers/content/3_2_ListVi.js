'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CreateVICtrl
 * @description
 * # CreateVICtrl
 * Controller of the webappApp
 */
angular.module('mqnaasApp')
    .controller('createdVIController', function ($scope, $rootScope, $filter, localStorageService, $interval, $alert, $modal, IMLService) {
        var promise;
        $scope.data = [];
        $scope.requestCollection = [];
        $scope.networkCollection = [];

        $scope.updateVIReqList = function () {

            var url = "viNetworks"
            IMLService.get(url).then(function (result) {
                $scope.networkCollection = [];
                if (result === undefined) return;
                $scope.networkCollection = _.map(result, function (e) {
                    if (e.period.period_end * 1000 < new Date().getTime()) {
                        return _.extend({}, e, {
                            disabled: true
                        });
                    } else {
                        return _.extend({}, e, {
                            disabled: false
                        });
                    }
                });
            });
        };

        $scope.deleteDialog = function (id, type) {
            $scope.itemToDeleteId = id;
            $scope.type = type;
            $modal({
                title: 'Are you sure you want to delete this item?',
                template: 'views/modals/modalRemove.html',
                show: true,
                scope: $scope
            });
        };

        $scope.deleteItem = function (id) {
            if ($scope.type === 'request') $scope.deleteVIRequest(id);
            else if ($scope.type === 'network') $scope.deleteVINetwork(id);
            this.$hide();
        };

        $scope.updateVIReqList();

        $scope.deleteVINetwork = function (viReq) {
            var url = "viNetworks/" + viReq
            IMLService.delete(url).then(function (result) {
                $scope.updateVIReqList();
            });
        };

        $scope.$on("$destroy", function () {
            if (promise) {
                $interval.cancel(promise);
            }
        });
    })
    .controller('viewVIController', function ($scope, $rootScope, $stateParams, $modal, localStorageService, IMLService) {
        $rootScope.virtNetId = $stateParams.id;

        var url = "viNetworks/" + $rootScope.virtNetId;
        IMLService.get(url).then(function (result) {
            if (result === undefined) return;
            console.log(result);
            $scope.vi = result;
            localStorageService.set("networkElements", result);
            //_($scope.vi.vi_resources).omit(_.isUndefined).omit(_.isNull).value();
            //var t = _.omit($scope.vi.vi_resources, function(v) { return _.isUndefined(v) || _.isNull(v); })
            //console.log(t);
            for(var j in $scope.vi.vi_resources){
                for (var i in $scope.vi.vi_resources[j]) {
                    if ($scope.vi.vi_resources[j][i] === null || $scope.vi.vi_resources[j][i] === undefined) {
                        delete $scope.vi.vi_resources[j][i];
                    }
                    console.log(i);
                    console.log($scope.vi.vi_resources[j]);
                    //if($scope.vi.vi_resources[j][i] !== undefined)
                    //if($scope.vi.vi_resources[j][i].vi_ports !== undefined)
                    if(i = "vi_ports"){
                        console.log($scope.vi.vi_resources[j][i]);
                        for (var t in $scope.vi.vi_resources[j][i]) {
                            console.log(t);
                            for (var w in $scope.vi.vi_resources[j][i][t]) {
                                if ($scope.vi.vi_resources[j][i][t][w] === null || $scope.vi.vi_resources[j][i][t][w] === undefined) {
                                    delete $scope.vi.vi_resources[j][i][t][w];
                                }
                            }
                        }
                    }
                }
            }

            $scope.jsonObj = JSON.stringify($scope.vi, undefined, 4);
        });

        $scope.getResourceInfo = function (element) {
            console.log("CLICK");
            console.log(element);
            url = "viNetworks/" + $rootScope.virtNetId + "/resource/" + element.id;
            IMLService.get(url).then(function (result) {
                if (result === undefined) return;
                $scope.virtualResource = result;
            });
        }

    });
