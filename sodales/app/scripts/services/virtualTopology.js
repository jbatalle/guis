'use strict';

angular.module('mqnaasApp')
    .factory('VirtualService', function ($q, $rootScope, MqNaaSResourceService) {
        var getSlice = function (resourceName, viId) { //get
            var deferred = $q.defer();
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/slice";
            MqNaaSResourceService.getText(url).then(function (data) {
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.slicing = {};
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };
                getUnits(resourceName, data);
                getCubes(resourceName, data);
                deferred.resolve(data.data);
            });
            return deferred.promise;
        };
        var getUnits = function (resourceName, sliceId) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/" + sliceId + "/IUnitManagement";
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };
        var getRangeUnit = function (resourceName, sliceId, unitId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + '/IRequestResourceManagement/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };
        var getCubes = function (resourceName, sliceId) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + "/ISliceProvider/" + sliceId + "/ISliceAdministration/cubes";
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };

        var getResource = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestManagement/' + $rootScope.viId + "/IRequestResourceManagement/" + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.id = data.resource.id;
                $rootScope.resourceInfo.type = data.resource.type;
                $rootScope.resourceInfo.ports = [];
                $rootScope.resourceInfo.ports = checkIfIsArray(data.resource.resources.resource);
                return checkIfIsArray(data.resource.resources.resource);
                //                return $scope.virtualResources;
            });
        };

        var virtualPorts = function (virtualResource) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRequestBasedNetworkManagement/' + $rootScope.virtNetId + '/IRootResourceProvider/' + virtualResource + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                $rootScope.virtualResource = data.resource;
                $rootScope.physicalPorts = checkIfIsArray(data.resource.resources.resource);

                $rootScope.virtualResource.ports = [];

                var ports = $rootScope.physicalPorts;
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/slice";
                MqNaaSResourceService.getText(url).then(function (result) {
                    var slice = result;
                    url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestBasedNetworkManagement/" + $rootScope.virtNetId + "/IRootResourceProvider/" + virtualResource + "/ISliceProvider/" + slice + "/ISliceAdministration/cubes";
                    MqNaaSResourceService.get(url).then(function (result) {
                        var cubes = checkIfIsArray(result.cubesList.cubes);
                        cubes.forEach(function (cube) {
                            var ranges = checkIfIsArray(cube.cube);
                            ranges.forEach(function (range) {
                                if (range.ranges.range.lowerBound === range.ranges.range.upperBound) {
                                    $rootScope.virtualResource.ports.push(ports[parseInt(range.ranges.range.lowerBound)]);
                                } else {
                                    var k = parseInt(range.ranges.range.lowerBound);
                                    while (k <= parseInt(range.ranges.range.upperBound)) {
                                        $rootScope.virtualResource.ports.push(ports[k]);
                                        k++;
                                    }
                                }
                            })
                        });
                    });
                });
            });
        };

        return {
            getSlice: function (resourceName) {
                return getSlice(resourceName);
            },
            getUnits: function (resourceName, sliceId) {
                return getUnits(resourceName, sliceId);
            },
            getRangeUnit: function (resourceName, sliceId, unitId) {
                return getRangeUnit(resourceName, sliceId, unitId);
            },
            getCubes: function (resourceName, sliceId) {
                return getCubes(resourceName, sliceId);
            },
            getResource: function (resourceName) {
                return getResource(resourceName);
            },
            virtualPorts: function (resourceName) {
                return virtualPorts(resourceName);
            },
        };
    });
