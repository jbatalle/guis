'use strict';

angular.module('mqnaasApp')
    .factory('PhysicalService', function ($q, $rootScope, MqNaaSResourceService, arnService) {
        var getSlice = function (resourceName) { //get
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/slice';
            MqNaaSResourceService.getText(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices = {};
                $rootScope.resourceInfo.slicing.slices = {
                    id: data,
                    units: [],
                    cubes: {}
                };
                getUnits(resourceName, data);
                getCubes(resourceName, data);
            });
        };
        var getUnits = function (resourceName, sliceId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement';
            MqNaaSResourceService.get(url).then(function (data) {
                var units = checkIfIsArray(data.IResource.IResourceId);
                units.forEach(function (unit) {
                    getRangeUnit(resourceName, sliceId, unit)
                });
            });
        };
        var getRangeUnit = function (resourceName, sliceId, unitId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/IUnitManagement/' + unitId;
            MqNaaSResourceService.get(url).then(function (data) {
                $rootScope.resourceInfo.slicing.slices.units.push({
                    id: unitId,
                    range: data
                });
            });
        };
        var getCubes = function (resourceName, sliceId) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/ISliceProvider/' + sliceId + '/ISliceAdministration/cubes';
            MqNaaSResourceService.get(url).then(function (data) {
                var arrayCubes = checkIfIsArray(data.cubesList.cubes);
                $rootScope.resourceInfo.slicing.slices.cubes = [];
                angular.forEach(arrayCubes, function (d) {
                        var arrayRanges = checkIfIsArray(d.cube.ranges.range);
                        $rootScope.resourceInfo.slicing.slices.cubes.push(arrayRanges);
                    })
                    //$rootScope.resourceInfo.slicing.slices.cubes = checkIfIsArray(data.cubesList.cubes);
                return data;
            });
        };
        var getResource = function (resourceName) {
            var url = 'IRootResourceAdministration/' + $rootScope.networkId + '/IRootResourceAdministration/' + resourceName + '/IResourceModelReader/resourceModel';
            MqNaaSResourceService.list(url).then(function (data) {
                $rootScope.resourceInfo = {};
                $rootScope.resourceInfo.layer = "physical";
                $rootScope.resourceInfo.id = data.resource.id;
                $rootScope.resourceInfo.type = data.resource.type;
                $rootScope.resourceUri = data.resource.descriptor.endpoints.endpoint.uri;
                if (data.resource.type === 'Network' && data.resource.type === 'link' && data.resource.type === undefined) {
                    ///nothing
                } else if (data.resource.type === 'CPE') {
                    $rootScope.resourceInfo.ports = [];
                    var cpePorts = checkIfIsArray(data.resource.resources.resource);
                    angular.forEach(cpePorts, function (port) {
                        if (parseInt(port.attributes.entry[0].value) > 99 && parseInt(port.attributes.entry[0].value) < 112)
                            $rootScope.resourceInfo.ports.push(port);
                    });
                } else {
                    //if is ARN, get Card, and type of port
                    arnService.put(getAllInterfaces()).then(function (data) {
                        $rootScope.resourceInfo.ports = checkIfIsArray(data.response.operation.interfaceList.interface);
                    });
                }
                $rootScope.resourceInfo.slicing = {};
                getSlice(resourceName);
            });
        }
        var getPhysicalPorts = function (resourceName) {
            var deferred = $q.defer();
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IResourceModelReader/resourceModel";
            var promise = MqNaaSResourceService.get(url).then(
                function (data) {
                    var ports = [];
                    if (data.resource.type === 'CPE') {
                        //$rootScope.resourceInfo.ports = [];
                        var cpePorts = checkIfIsArray(data.resource.resources.resource);
                        angular.forEach(cpePorts, function (port) {
                        if (parseInt(port.attributes.entry[0].value) > 99 && parseInt(port.attributes.entry[0].value) < 112)
                            ports.push(port);
                        });

                    } else if (data.resource.type === 'ARN') {
                        var deferred2 = $q.defer(); 
                            //if is ARN, get Card, and type of port
                        ports = arnService.put(getAllInterfaces()).then(function (data) {
                            ports = checkIfIsArray(data.response.operation.interfaceList.interface);
                           // deferred2.resolve(ports);
                            return $q.when(ports);
                        },
                        function (response) {
                            deferred2.reject(response.data);
                        });
                        console.log(ports);
                    }
                    //deferred.promise;
                    return ports;
                    //return checkIfIsArray(response.resource.resources.resource);
                },
                function (response) {
                    deferred.reject(response.data);
                }
            );
            return promise;
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
            getPhysicalPorts: function (resourceName) {
                return getPhysicalPorts(resourceName);
            },
            getPhysicalPortsInformation: function (resourceName, type) {
                return getPhysicalPortsInformation(resourceName, type);
            }
        };
    });
